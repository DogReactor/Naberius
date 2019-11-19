import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { FilesResolver } from './files.resolver';
import { DataModule } from '../data/data.module';

@Module({
  imports: [ConfigModule, DataModule],
  providers: [FilesResolver],
})
export class FilesModule {}
