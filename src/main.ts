import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
// import { join } from 'path';

import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule); // NestExpressApplication enables access to Express-specific features in NestJS, such as serving static files. It was added becuse we nedd to access static files in the public folder like as poses images.

  // The join function is used to join file paths securely and is compatible with any operating system (Windows, Mac, Linux).
  //app.useStaticAssets(...) tells NestJS that everything you put in the /public folder will be available via URL.
  // So, if you put an image in /public/img/poses/cat-pose.jpg, your frontend can access it at http://localhost:3000/img/poses/cat-pose.jpg.

  app.useStaticAssets('/Users/Isa/Github/inner-flow-nestjs/public');

  // CORS: CORS added to allows frontend to request resources from different domain securely
  app.enableCors({
    origin: 'http://localhost:5173',
    // origin: 'https://inner-flow.com',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
