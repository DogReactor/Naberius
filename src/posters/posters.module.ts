import { Module } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { PostersResolver } from './posters.resolver';
import { LoggerModule } from 'logger/logger.module';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [PostersResolver],
})
export class PostersModule {}
