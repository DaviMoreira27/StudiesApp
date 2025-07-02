import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InvalidWebhookToken } from '../../errors/message.errors';
import {
  HubChallengeDTO,
  HubModeDTO,
  HubVerifyTokenDTO,
} from '../../types/message.types';

@Injectable()
export class MessagingService {
  private readonly verifyToken: string;

  constructor(private configService: ConfigService) {
    this.verifyToken = this.configService.get<string>('whatsappVerifyToken', '');
  }

  validateWebhook(
    mode: HubModeDTO,
    challenge: HubChallengeDTO,
    token: HubVerifyTokenDTO,
  ): HubChallengeDTO {
    if (
      mode['hub.mode'] === 'subscribe' &&
      token['hub.verify_token'] === this.verifyToken
    ) {
      return challenge;
    }
    throw new InvalidWebhookToken('VALIDATE_WEBHOOK');
  }

  processWhatsAppMessage(payload: any) {
    console.log(
      'Processing WhatsApp message:',
      JSON.parse(JSON.stringify(payload)),
    );
  }
}
