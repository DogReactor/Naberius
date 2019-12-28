import { Module } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { DataModule } from 'data/data.module';
import { QuestsResolver } from './quests.resolver';
import { MissionsResolver } from './missions.resolver';
import { MapResolver } from './maps.resolver';
import { EnemiesResolver } from './enemies.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from 'data/models/file.model';
import { MissilesResolver } from './missiles.resolver';
import { QuestConfigMeta } from 'data/models/questConfigMeta.model';
import { LoggerModule } from 'logger/logger.module';
import { QuestConfigsResolver } from './questConfigs.resolver';
import { EnemyConfigsResolver } from './enemyConfigs.resolver';
import { EnemyConfigMeta } from 'data/models/enemyConfigMeta.model';

@Module({
  imports: [
    ConfigModule,
    DataModule,
    TypeOrmModule.forFeature([File, QuestConfigMeta, EnemyConfigMeta]),
    LoggerModule,
  ],
  providers: [
    QuestsResolver,
    MissionsResolver,
    MapResolver,
    EnemiesResolver,
    MissilesResolver,
    QuestConfigsResolver,
    EnemyConfigsResolver,
  ],
})
export class QuestsModule {}
