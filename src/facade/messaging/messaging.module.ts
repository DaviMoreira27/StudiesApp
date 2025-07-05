import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from 'src/database/entities/message.entity';
import { MessagingService } from './messaging.service';
import { ConfigService } from '@nestjs/config';
import { Conversations } from 'src/database/entities/conversation.entity';
import { Contacts } from 'src/database/entities/contact.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Messages, Conversations, Contacts])],
  providers: [MessagingService, ConfigService],
  exports: [TypeOrmModule],
})
export class MessagingModule {}
