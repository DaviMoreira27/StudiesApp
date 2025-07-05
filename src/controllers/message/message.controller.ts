import { Controller, Get, Query, Body, Post, Res } from '@nestjs/common';
import { MessagingService } from '../../facade/messaging/messaging.service';
import {
  WhatsAppWebhookPayloadDTO,
  HubWebhookQueryDTO,
} from '../../types/message.types';
import { Response } from 'express';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessagingService) {}

  @Get('webhook')
  authWebhook(@Query() query: HubWebhookQueryDTO) {
    const mode = query['hub.mode'];
    const challenge = query['hub.challenge'];
    const token = query['hub.verify_token'];

    return this.messageService.validateWebhook(mode, challenge, token);
  }

  @Post('webhook')
  async messageHandler(@Body() body: WhatsAppWebhookPayloadDTO) {
    this.messageService.processWhatsAppMessage(body);

    await this.messageService.processWhatsAppMessage(body);

  }
}
