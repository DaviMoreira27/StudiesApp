import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { ValidationAppError } from './global/errors/global.errors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      logLevels: ['error', 'log', 'debug'],
      json: true,
    }),
  });
  app.useGlobalPipes(
    new ValidationPipe({
      // TODO: Handle better validation errors
      exceptionFactory: (errors) =>
        new ValidationAppError(
          errors.map((err) => Object.values(err.constraints || {})).flat(),
        ),
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
