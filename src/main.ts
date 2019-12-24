import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ParsedConfigService } from 'config/config.service';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.useStaticAssets(app.get(ParsedConfigService).get('CACHE_DIR'), {
    prefix: '/static/',
  });

  app.useStaticAssets(join(__dirname, '..', 'static'), { prefix: '/static/' });

  await app.listen(app.get(ParsedConfigService).get('PORT'));
}

bootstrap();
