import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { METHODS } from 'http';

dotenv.config()

async function bootstrap() { 
  console.log('JWT_SECRET in main.ts =', process.env.JWT_SECRET);
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    METHODS: 'GET, POST, PUT, DELETE',
    Credential: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
