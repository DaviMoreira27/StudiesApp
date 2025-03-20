import { Test, TestingModule } from '@nestjs/testing';
import { GoogleStorageService } from './google-storage.service';
import { Bucket, File, Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { Writable } from 'stream';

describe('GoogleStorageService', () => {
  // Define all the values that I will be using
  let service: GoogleStorageService;
  let bucketMock: Partial<Bucket>;
  let configServiceMock: Partial<ConfigService>;
  let file: Partial<File>;

  // It will run before each test
  beforeEach(async () => {
    file = {
      createWriteStream: jest.fn().mockImplementation((options?: { contentType?: string; resumable?: boolean }) => {
        const { contentType, resumable = false } = options || {}; // Extraindo os parâmetros com valores padrão

        const stream = new Writable({
          write(chunk, encoding, callback) {
            callback();
          },
        });

        stream.on = jest.fn((event, callback) => {
          if (event === 'finish') {
            setImmediate(callback);
          }
          if (event === 'error') {
            setImmediate(() => callback(new Error('Upload failed')));
          }
          return stream;
        });

        console.log(`Mocked createWriteStream called with: contentType=${contentType}, resumable=${resumable}`);
        return stream;
      }),
    };

    // Mocking the Google Storage Bucket class, because its define as partial we only have to inform the 2 methods that we will use
    bucketMock = {
      // getMetadata: an async mocked function that will return an array with a timeCreated object when resolved
      getMetadata: jest.fn().mockResolvedValue([{ timeCreated: '2024-03-10T12:00:00Z' }]),
      // getFiles: an async mocked function that will return an array with Google Storage Files objects when resolved
      getFiles: jest
        .fn()
        .mockResolvedValue([
          [
            { metadata: { timeCreated: '2024-03-11T12:00:00Z' } } as Partial<File>,
            { metadata: { timeCreated: '2024-03-12T12:00:00Z' } } as Partial<File>,
          ],
        ]),
      file: jest
        .fn()
        .mockImplementation((filePath: string) => new File(bucketMock as Bucket, filePath))
        .mockResolvedValue(file),
    };

    // Defining the Google Storage class mock, we are saying that for the bucket property
    // it will return a mocked value defined by bucketMock that we assigned earlier
    const storageMock: Partial<Storage> = {
      bucket: jest.fn().mockReturnValue(bucketMock),
    };

    // We are mocking the config service, it expects a key that will be used to return the env configuration
    configServiceMock = {
      get: jest.fn((key) => {
        if (key === 'googleBucket') return 'mock-bucket';
        if (key === 'googleAccountCredentials') return 'mock-credentials.json';
        return null;
      }),
    };

    /*
       Now we need to define the test module, the full object that we will use in this test
       We define the HttpModule, to enable the HttpService declared in the GoogleStorageService constructor,
       as providers we pass the GoogleStorageService that is the class being tested
       and all the providers that it will user, configService and Storage (HttpService is already enabled because of the HttpModule)
       At least we ask it to compile and construct the test object
    */

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        GoogleStorageService,
        { provide: ConfigService, useValue: configServiceMock },
        { provide: Storage, useFactory: () => storageMock },
      ],
    }).compile();

    // Now the service variable that we have defined earlier will be assigned the testing module declared earlier
    // All the calls will be made to this test module
    service = module.get<GoogleStorageService>(GoogleStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call getMetadata and getFiles, and return filtered files', (done) => {
    const startDate = new Date('2024-03-11T00:00:00Z');
    const endDate = new Date('2024-03-12T23:59:59Z');

    service.getAllFiles(startDate, endDate).subscribe({
      next: (files: File[]) => {
        expect(files.length).toBe(2);
        expect(bucketMock.getMetadata).toHaveBeenCalled();
        expect(bucketMock.getFiles).toHaveBeenCalledWith({ prefix: 'notion/subjects/images/' });
        done();
      },
      error: () => {
        done();
      },
    });
  });

  it('should upload a file to the bucket', (done) => {
    const fileUrl = 'https://fastly.picsum.photos/id/85/200/300.jpg?hmac=_MELEMGQCalX-bflh-qD89Z5VjdVMfVXD68WblQSLM8';
    const filePath = 'notion/subjects/images/software-requirements/';
    service.uploadFile(fileUrl, filePath).subscribe({
      next: () => {
        console.log('Sucess');
      },
      error: () => {
        done();
      },
    });
  });
});
