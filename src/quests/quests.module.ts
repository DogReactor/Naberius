import { Module } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { DataModule } from 'data/data.module';
import { QuestsResolver } from './quests.resolver';
import { MissionsResolver } from './missions.resolver';
import { MapResolver } from './map.resolver';
import { EnemyResolver } from './enemy.resolver';

@Module({
  imports: [ConfigModule, DataModule],
  providers: [QuestsResolver, MissionsResolver, MapResolver, EnemyResolver],
})
export class QuestsModule {}
