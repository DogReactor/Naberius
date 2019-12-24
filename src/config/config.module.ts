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
  providers: [
    {
      provide: ParsedConfigService,
      inject: [Logger, NestConfigService],
      useFactory: (logger: Logger, config: NestConfigService) => {
        console.log(config);
        return new ParsedConfigService(logger, config, '.');
      },
    },
  ],
  exports: [ParsedConfigService],
})
export class ConfigModule {}
