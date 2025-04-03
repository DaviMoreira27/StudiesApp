import { File, Storage } from '@google-cloud/storage';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import config from 'src/config/config';
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


  it('Should upload a file', (done) => {
    const fileUrl = 'https://fastly.picsum.photos/id/85/200/300.jpg?hmac=_MELEMGQCalX-bflh-qD89Z5VjdVMfVXD68WblQSLM8';
    const filePath = 'notion/subjects/software-requirements/images/image-04-02.jpg';

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

  it('Should retrieve all the files from a given subject', (done) => {
    googleService.getAllFiles(undefined, undefined, 'software-requirements').subscribe({
      next: (response: File[]) => {
        expect(response).toBeInstanceOf(Array<File>);
        expect(response.length > 0).toBeTruthy();
      },
      error: (error: Error) => {
        console.log('Integration test error: ', error.message);
        done(error);
      },
      complete: () => {
        done();
      },
    });
  })
});
