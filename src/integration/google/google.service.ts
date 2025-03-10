import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleService {
  constructor(
    private readonly configService: ConfigService,
    private readonly googleStorage: Storage,
  ) {
    this.googleStorage.bucket(this.configService.get<string>('googleBucket')!);
  }
}
