import { Module } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { RequestService } from './request.service';

@Module({
  imports: [ConfigModule],
  providers: [RequestService],
  exports: [RequestService],
})
export class CommonModule {}
