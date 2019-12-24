import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { FilesResolver } from './files.resolver';
import { DataModule } from '../data/data.module';
import { FilesController } from './files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'data/models/file.model';

@Module({
  imports: [ConfigModule, DataModule, TypeOrmModule.forFeature([File])],
  providers: [FilesResolver],
  controllers: [FilesController],
})
export class FilesModule {}
