import { Test, TestingModule } from '@nestjs/testing';
import { AmazonS3Service } from './amazon-s3.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Readable } from 'stream';

describe('AmazonS3Service', () => {
  let service: AmazonS3Service;
  let httpServiceMock: Partial<HttpService>;

  beforeEach(async () => {
    const readableStream = Readable.from([]);
    
    httpServiceMock = {
      get: jest.fn().mockImplementation((url: string) => {
        if (url.includes('false-url')) {
          throw new Error('getaddrinfo ENOTFOUND');
        }

        return {data: readableStream}
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [AmazonS3Service, 
        { provide: HttpService, useValue: httpServiceMock },
      ],
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              secretKey: 'test-secret',
              accessKey: 'test-access',
            }),
          ],
        })
      ],
    }).compile();

    service = module.get<AmazonS3Service>(AmazonS3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
