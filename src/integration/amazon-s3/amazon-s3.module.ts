import { Module } from '@nestjs/common';
import { AmazonS3Service } from './amazon-s3.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [AmazonS3Service],
  imports: [HttpModule]
})
export class AmazonS3Module {}
