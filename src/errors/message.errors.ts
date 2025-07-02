import { HttpStatusCode } from 'axios';
import { ExternalServiceError, MainAppError } from 'src/app.error';

export abstract class MessageError extends MainAppError {
  constructor(
    message: string,
    httpCode: HttpStatusCode,
    httpTrace: string,
    externalServiceError?: ExternalServiceError,
  ) {
    super(
      message,
      httpCode,
      `MESSAGE_ERROR-${httpTrace}`,
      externalServiceError,
    );
  }
}

export class InvalidWebhookToken extends MessageError {
  constructor(httpTrace?: string) {
    const completeTrace = httpTrace
      ? `INVALID_WEBHOOK_TOKEN-${httpTrace}`
      : 'INVALID_WEBHOOK_TOKEN';
    super(
      'The token received is not equal to the passed one',
      HttpStatusCode.BadRequest,
      completeTrace,
    );
  }
}
