import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Enable CORS for frontend app (adjust origin in .env if necessary)
  app.enableCors({ origin: process.env.CORS_ORIGIN || 'http://localhost:4200', credentials: true });

  // Swagger is optional; install `@nestjs/swagger` and re-add swagger setup if needed.

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`✅ Server running on http://localhost:${port}`);
}

bootstrap();

