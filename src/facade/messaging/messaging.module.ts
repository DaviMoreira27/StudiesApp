import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/database/entities/message.entity';
import { MessagingService } from './messaging.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessagingService, ConfigService],
  exports: [TypeOrmModule],
})
export class MessagingModule {}
