import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvalidWebhookToken } from '../../errors/message.errors';
import { WhatsAppWebhookPayloadDTO } from 'src/types/message.types';

@Injectable()
export class MessagingService {
  private readonly verifyToken: string;

  constructor(private configService: ConfigService) {
    this.verifyToken = this.configService.get<string>('whatsappVerifyToken', '');
  }

  validateWebhook(mode: string, challenge: string, token: string): string {
    if (mode === 'subscribe' && token === this.verifyToken) {
      return challenge;
    }
    throw new InvalidWebhookToken('VALIDATE_WEBHOOK');
  }

  processWhatsAppMessage(payload: WhatsAppWebhookPayloadDTO) {
    console.dir(payload, { depth: null, colors: true });
  }
}
