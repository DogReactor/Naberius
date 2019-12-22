import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { LoggerModule } from 'logger/logger.module';
import { Logger } from 'logger/logger.service';

@Module({
  imports: [LoggerModule],
  providers: [
    {
      provide: ConfigService,
      inject: [Logger],
      useFactory: (logger: Logger) => new ConfigService(logger, '.'),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
