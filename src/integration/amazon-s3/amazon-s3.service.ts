import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AmazonS3Service {
  private readonly secretKey: string;
  private readonly accessKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.secretKey = this.configService.get<string>('secretKey') ?? '';
    this.accessKey = this.configService.get<string>('accessKey') ?? '';
  }
}
