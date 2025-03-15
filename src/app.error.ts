import { HttpStatusCode } from 'axios';

export interface AppError {
  message: string;
  httpCode: HttpStatusCode;
  externalServiceError?: ExternalServiceError;
}

interface ExternalServiceError {
  service: ExternalServices;
  message: string;
  httpCode: HttpStatusCode;
}

enum ExternalServices {
  GOOGLE_STORAGE = 'GOOGLE_STORAGE',
  WHATSSAP = 'WHATSSAP',
  NOTION = 'NOTION',
}

export abstract class MainAppError extends Error implements AppError {
  public readonly httpCode: HttpStatusCode;
  public readonly externalServiceError?: ExternalServiceError;

  constructor(message: string, httpCode: HttpStatusCode, externalServiceError?: ExternalServiceError) {
    super(message);
    this.httpCode = httpCode;
    this.externalServiceError = externalServiceError;
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
