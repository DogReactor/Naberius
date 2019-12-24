import { Module } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { DataModule } from 'data/data.module';
import { QuestsResolver } from './quests.resolver';
import { MissionsResolver } from './missions.resolver';
import { MapResolver } from './map.resolver';
import { EnemyResolver } from './enemy.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'data/models/file.model';

@Module({
  imports: [ConfigModule, DataModule, TypeOrmModule.forFeature([File])],
  providers: [QuestsResolver, MissionsResolver, MapResolver, EnemyResolver],
})
export class QuestsModule {}
