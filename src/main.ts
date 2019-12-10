import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { stat } from 'fs-extra';
import { ConfigService } from 'config/config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.useStaticAssets(app.get(ConfigService).get('STATIC_DIR'), {
    prefix: '/static/',
  });

  await app.listen(4000);
}

bootstrap();
