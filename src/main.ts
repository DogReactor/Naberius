import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ParsedConfigService } from 'config/config.service';
import { join } from 'path';
import { Request } from "express";
import * as cors from 'cors';

// 防止console.error直接终止node进程
process.on('unhandledRejection', (reason, promise) => {
  console.log('unhandledRejection', reason, promise);
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.use(cors());

  app.useStaticAssets(app.get(ParsedConfigService).get('CACHE_DIR'), {
    prefix: '/static/',
  });

  app.useStaticAssets(join(__dirname, '..', 'static'), { prefix: '/static/' });

  await app.listen(app.get(ParsedConfigService).get('PORT'));
}

bootstrap();
