import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { RequestService } from './request.service';
import { DataModule } from 'data/data.module';
import { DateScalar } from './date.scalar';
import { LoggerModule } from 'logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'data/models/file.model';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    TypeOrmModule.forFeature([File]),
    forwardRef(() => DataModule),
  ],
  providers: [RequestService, DateScalar],
  exports: [RequestService],
})
export class CommonModule {}
