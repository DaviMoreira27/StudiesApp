import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotionService } from './integration/notion/notion.service';
import { MessagingService } from './facade/messaging/messaging.service';
import { StorageService } from './facade/storage/storage.service';
import { NotesService } from './facade/notes/notes.service';
import config from './config/config';
import { HttpModule } from '@nestjs/axios';
import { GoogleStorageModule } from './integration/google-storage/google-storage.module';
import { GoogleStorageService } from './integration/google-storage/google-storage.service';
import { MessageController } from './controllers/message/message.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    HttpModule.register({
      timeout: 20000,
      maxRedirects: 5,
    }),
    GoogleStorageModule,
  ],
  controllers: [MessageController],
  providers: [
    NotionService,
    MessagingService,
    StorageService,
    NotesService,
  ],
})
export class AppModule {}
