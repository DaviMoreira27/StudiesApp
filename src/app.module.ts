import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotionService } from './integration/notion/notion.service';
import { MessagingService } from './facade/messaging/messaging.service';
import { StorageService } from './facade/storage/storage.service';
import { NotesService } from './facade/notes/notes.service';
import { HttpModule } from '@nestjs/axios';
import { GoogleStorageModule } from './integration/google-storage/google-storage.module';
import { MessageController } from './controllers/message/message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/config';
import { Contacts } from './database/entities/contact.entity';
import { Conversations } from './database/entities/conversation.entity';
import { Messages } from './database/entities/message.entity';
import { MessagingModule } from './facade/messaging/messaging.module';

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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('databaseHost')!,
        port: configService.get<number>('databasePort')!,
        username: configService.get<string>('databaseUser')!,
        password: configService.get<string>('databasePassword')!,
        database: configService.get<string>('databaseName')!,
        entities: [Contacts, Conversations, Messages],
        synchronize: configService.get<boolean>('databaseSync')!,
        logging: configService.get<boolean>('databaseLogging')
      }),
    }),
    MessagingModule,
  ],
  controllers: [MessageController],
  providers: [NotionService, MessagingService, StorageService, NotesService],
})
export class AppModule {}
