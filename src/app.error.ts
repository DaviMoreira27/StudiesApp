import { HttpException } from '@nestjs/common';
import { HttpStatusCode } from 'axios';

export interface AppError {
  message: string;
  httpCode: HttpStatusCode;
  httpTrace: string;
  externalServiceError?: ExternalServiceError;
}

export interface ExternalServiceError {
  service: ExternalServices;
  message: string;
  httpCode: HttpStatusCode;
}

export enum ExternalServices {
  GOOGLE_STORAGE = 'GOOGLE_STORAGE',
  WHATSSAP = 'WHATSSAP',
  NOTION = 'NOTION',
}

export abstract class MainAppError extends HttpException implements AppError {
  public readonly httpCode: HttpStatusCode;
  public readonly httpTrace: string;
  public readonly externalServiceError?: ExternalServiceError;

  constructor(
    message: string,
    httpCode: HttpStatusCode,
    httpTrace: string,
    externalServiceError?: ExternalServiceError,
  ) {
    super(
      {
        message,
        httpTrace,
        httpCode,
        externalServiceError,
      },
      httpCode,
    );

    this.httpCode = httpCode;
    this.httpTrace = httpTrace;
    this.externalServiceError = externalServiceError;
  }
}
