import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const corsOrigin = configService.get<string>('CORS_ORIGIN');

  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: corsOrigin,
    exposedHeaders: ['X-Total-Count'],
  });
  app.setGlobalPrefix('api/v1');
  await app.listen(5000);
}
bootstrap();
