import { Storage } from '@google-cloud/storage';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import config from 'src/config/config';
import { GoogleStorageModule } from 'src/integration/google-storage/google-storage.module';
import { GoogleStorageService } from 'src/integration/google-storage/google-storage.service';

describe('Google Storage Integration', () => {
  let app: any;
  let googleService: GoogleStorageService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true, load: [config] })],
      providers: [ConfigService, Storage, GoogleStorageService],
    }).compile();

    app = module.createNestApplication();
    googleService = module.get(GoogleStorageService);

    await app.init();
  });


  it('Should upload a file to the GCP bucket', (done) => {
    const fileUrl = 'https://fastly.picsum.photos/id/85/200/300.jpg?hmac=_MELEMGQCalX-bflh-qD89Z5VjdVMfVXD68WblQSLM8';
    const filePath = 'notion/subjects/images/software-requirements/image-04-02-jpg';

    googleService.uploadFile(fileUrl, filePath).subscribe({
      next: (response: string) => {
        expect(response).toEqual(filePath);
      },
      error: (error: Error) => {
        console.log('Integration test error: ', error.message);
        done(error);
      },
      complete: () => {
        done();
      },
    });
  });
});
