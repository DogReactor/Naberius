import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { RequestService } from './request.service';
import { DataModule } from 'data/data.module';
import { DateScalar } from './date.scalar';
import { LoggerModule } from 'logger/logger.module';

@Module({
  imports: [LoggerModule, ConfigModule, forwardRef(() => DataModule)],
  providers: [RequestService, DateScalar],
  exports: [RequestService],
})
export class CommonModule {}
