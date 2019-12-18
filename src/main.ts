import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from 'config/config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.useStaticAssets(app.get(ConfigService).get('CACHE_DIR'), {
    prefix: '/static/',
  });

  app.useStaticAssets('static', { prefix: '/static/' });

  await app.listen(4000);
}

bootstrap();
