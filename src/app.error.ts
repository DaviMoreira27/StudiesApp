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

export abstract class MainAppError extends Error {}
