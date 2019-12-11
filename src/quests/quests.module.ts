import { Module } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { DataModule } from 'data/data.module';
import { QuestsResolver } from './quests.resolver';
import { MissionsResolver } from './missions.resolver';

@Module({
  imports: [ConfigModule, DataModule],
  providers: [QuestsResolver, MissionsResolver],
})
export class QuestsModule {}
