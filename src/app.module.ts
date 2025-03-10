import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotionService } from './integration/notion/notion.service';
import { WhatssapService } from './integration/whatssap/whatssap.service';
import { GoogleService } from './integration/google/google.service';
import { MessagingService } from './facade/messaging/messaging.service';
import { StorageService } from './facade/storage/storage.service';
import { NotesService } from './facade/notes/notes.service';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
  ],
  controllers: [],
  providers: [
    NotionService,
    WhatssapService,
    GoogleService,
    MessagingService,
    StorageService,
    NotesService,
  ],
})
export class AppModule {}
