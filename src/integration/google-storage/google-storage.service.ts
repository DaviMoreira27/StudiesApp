import { Bucket, Storage } from '@google-cloud/storage';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import Stream from 'stream';

@Injectable()
export class GoogleStorageService {
  private readonly bucket: Bucket;

  constructor(
    private readonly configService: ConfigService,
    private readonly googleStorage: Storage,
    private readonly httpService: HttpService,
  ) {
    this.bucket = this.googleStorage.bucket(
      this.configService.get<string>('googleBucket')!,
    );
  }

  uploadFile(fileUrl: string, filePath: string): Observable<string> {
    // This method will return an observable
    // It receives as first parameters a subscriber that the observable will listen on
    return new Observable<string>((observer) => {
      this.httpService
        .get<Stream>(fileUrl, { responseType: 'stream' })
        .subscribe({
          // When the server is ready to return the first chunk, it will receive a stream as the response
          next: (response: AxiosResponse<Stream>) => {
            // The next will not be initiated for each chunk, but only for the stream
            // While its here, it will continue to receive chunks data, but will not start a new next call
            const storageFile = this.bucket.file(filePath);
            // Creating a write stream to upload the file to the GCP Storage
            const writeStream = storageFile.createWriteStream({
              contentType: 'image/jpeg',
              resumable: false,
            });

            // For each chunk received, it will pipe then directly to the GCP Storage
            response.data.pipe(writeStream);

            // If ends sucessfully, it will call the `writeStream.on` on finish
            writeStream.on('finish', () => {
              observer.next(`Upload completed: ${filePath}`);
              observer.complete();
            });

            // If not it will call it on error
            writeStream.on('error', (err) => {
              // This will be called to handle the error from the file upload
              observer.error(err);
            });
          },
          error: (err) => {
            // This will be called to handle the error from the file download
            observer.error(err);
          },
        });
    });
  }
}
