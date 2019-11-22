import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { RequestService } from './request.service';
import { DataModule } from 'data/data.module';

@Module({
  imports: [ConfigModule, forwardRef(() => DataModule)],
  providers: [RequestService],
  exports: [RequestService],
})
export class CommonModule {}
