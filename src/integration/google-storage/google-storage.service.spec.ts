import { Test, TestingModule } from '@nestjs/testing';
import { GoogleStorageService } from './google-storage.service';
import { Bucket, File, Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import Stream, { Readable, Writable } from 'stream';
import { of, throwError } from 'rxjs';

describe('GoogleStorageService', () => {
  // Define all the values that I will be using
  let service: GoogleStorageService;
  let bucketMock: Partial<Bucket>;
  let configServiceMock: Partial<ConfigService>;
  let file: Partial<File>;
  let httpServiceMock: Partial<HttpService>;

  // It will run before each test
  beforeEach(async () => {
    file = {
      createWriteStream: jest.fn().mockImplementation((options?: { contentType?: string; resumable?: boolean }) => {
        const { contentType, resumable = false } = options || {};

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
        .mockReturnValue(file),
    };

    // Defining the Google Storage class mock, we are saying that for the bucket property
    // it will return a mocked value defined by bucketMock that we assigned earlier
    const storageMock: Partial<Storage> = {
      bucket: jest.fn().mockReturnValue(bucketMock),
    };

    const readableStream = Readable.from([]);

    httpServiceMock = {
      get: jest.fn().mockImplementation((url: string) => {
        if (url.includes('false-url')) {
          return throwError(() => new Error('getaddrinfo ENOTFOUND'));
        }

        return of({data: readableStream})
      }),
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
      providers: [
        GoogleStorageService,
        { provide: ConfigService, useValue: configServiceMock },
        { provide: Storage, useFactory: () => storageMock },
        { provide: HttpService, useValue: httpServiceMock },
      ],
    }).compile();

    // Now the service variable that we have defined earlier will be assigned the testing module declared earlier
    // All the calls will be made to this test module
    service = module.get<GoogleStorageService>(GoogleStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /*
    1. Return filtered files with correct filters
    2. Return no files because of incorrect filters
    3. Throw error on incorrect file path on upload
    4. Successfully upload file to bucket
  */

  describe('Testing file retrieval and filters', () => {
    it('should call getMetadata and getFiles, and return filtered files', (done) => {
      const startDate = new Date('2024-03-11T00:00:00Z');
      const endDate = new Date('2024-03-12T23:59:59Z');

      service.getAllFiles(startDate, endDate).subscribe({
        next: (files: File[]) => {
          expect(files.length).toBe(2);
          expect(bucketMock.getMetadata).toHaveBeenCalled();
          expect(bucketMock.getFiles).toHaveBeenCalledWith({ prefix: 'notion/subjects' });
          done();
        },
        error: (error: Error) => {
          done(error);
        },
      });
    });

    it('should return an empty File array', (done) => {
      const startDate = new Date('2025-03-11T00:00:00Z');
      const endDate = new Date('2025-03-12T23:59:59Z');

      service.getAllFiles(startDate, endDate).subscribe({
        next: (files: File[]) => {
          expect(files.length).toBe(0);
          done();
        },
        error: (error: Error) => {
          done(error);
        },
      });
    });
  });

  describe('Testing file upload', () => {
    it('should throw an error if the file to upload is not accessible', (done) => {
      const fileUrl = 'https://false-url.fortest';
      const filePath = 'notion/subjects/images/software-requirements/';

      service.uploadFile(fileUrl, filePath).subscribe({
        error: (error: Error) => {
          expect(error).toBeDefined();
          done();
        },
        complete: () => {
          done.fail('Expected an error, but got a success emission.');
        },
      });
    });

    it('should upload a file to the bucket', (done) => {
      const fileUrl = 'https://correct-url.com';
      const filePath = 'notion/subjects/images/software-requirements/image-04-02-jpg';

      service.uploadFile(fileUrl, filePath).subscribe({
        next: (response: string) => {
          expect(response).toEqual(filePath);
        },
        complete: () => {
          done();
        },
      });
    });

    it('should upload a file to the bucket correctly with an empty file path', (done) => {
      const fileUrl = 'https://correct-url.com';
      const filePath = '';

      service.uploadFile(fileUrl, filePath).subscribe({
        next: (response: string) => {
          expect(response).toEqual(filePath);
        },
        complete: () => {
          done();
        },
      });
    });

    // FIX-ME: This test suite is ending in the complete clause.
    it('should not upload a file to the bucket because of an incorrect file url', (done) => {
      const fileUrl = 'nothing';
      const filePath = '';

      service.uploadFile(fileUrl, filePath).subscribe({
        error: (error: Error) => {
          expect(error).toBeDefined();
          done();
        },
        complete: () => {
          done();
        }
      });
    });
  });
});
