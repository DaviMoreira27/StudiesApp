import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { MessagingService } from '../../facade/messaging/messaging.service';
import {
  WhatsAppWebhookPayloadDTO,
  HubChallengeDTO,
  HubModeDTO,
  HubVerifyTokenDTO,
} from '../../types/message.types';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessagingService) {}

  @Get('webhook')
  authWebhook(
    @Query('hub.mode') mode: HubModeDTO,
    @Query('hub.challenge') challenge: HubChallengeDTO,
    @Query('hub.verify_token') token: HubVerifyTokenDTO,
  ) {
    return this.messageService.validateWebhook(mode, challenge, token);
  }

  @Post('webhook')
  getWhatsAppMessage(@Body() body: WhatsAppWebhookPayloadDTO) {
    this.messageService.processWhatsAppMessage(body);
  }
}
