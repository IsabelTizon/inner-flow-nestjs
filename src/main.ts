import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { join } from 'path';

import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // NestExpressApplication enables access to Express-specific features in NestJS, such as serving static files. It was added becuse we nedd to access static files in the public folder like as poses images.

  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/',
  });

  app.enableCors({
    // origin: 'http://localhost:5173',
    origin: 'https://inner-flow.vercel.app',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
