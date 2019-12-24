import { Module } from '@nestjs/common';
import { ParsedConfigService } from './config.service';
import { LoggerModule } from 'logger/logger.module';
import { Logger } from 'logger/logger.service';
import {
  ConfigModule as NestConfigModule,
  ConfigService as NestConfigService,
} from '@nestjs/config';

@Module({
  imports: [LoggerModule, NestConfigModule],
  providers: [ParsedConfigService],
  exports: [ParsedConfigService],
})
export class ConfigModule {}
