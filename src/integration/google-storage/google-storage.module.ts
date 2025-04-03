import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GoogleStorageService } from './google-storage.service';
import { Storage } from '@google-cloud/storage';
import config from 'src/config/config';

@Module({
  imports: [HttpModule, ConfigModule.forRoot({ isGlobal: true, load: [config] })],
  providers: [
    GoogleStorageService,
    {
      provide: Storage,
      useFactory: (configService: ConfigService) => {
        return new Storage({
          keyFilename: configService.get<string>('googleAccountCredentials'),
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class GoogleStorageModule {}
