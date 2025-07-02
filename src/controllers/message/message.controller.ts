import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { MessagingService } from '../../facade/messaging/messaging.service';
import {
  WhatsAppWebhookPayloadDTO,
  HubWebhookQueryDTO,
} from '../../types/message.types';

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
  getWhatsAppMessage(@Body() body: WhatsAppWebhookPayloadDTO) {
    this.messageService.processWhatsAppMessage(body);
  }
}
