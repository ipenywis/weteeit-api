import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('Environment: ', process.env.NODE_ENV);

  //Cookie Parser
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  //TODO: Disable CORS for (DEV-ONLY)
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
