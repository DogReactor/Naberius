import { Module } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { DataModule } from 'data/data.module';
import { QuestsResolver } from './quests.resolver';
import { MissionsResolver } from './missions.resolver';
import { MapResolver } from './maps.resolver';
import { EnemiesResolver } from './enemies.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'data/models/file.model';

@Module({
  imports: [ConfigModule, DataModule, TypeOrmModule.forFeature([File])],
  providers: [
    QuestsResolver,
    MissionsResolver,
    MapResolver,
    EnemiesResolver,
    MissionsResolver,
  ],
})
export class QuestsModule {}
