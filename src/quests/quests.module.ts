import { Module } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { DataModule } from 'data/data.module';
import { QuestsResolver } from './quests.resolver';

@Module({
  imports: [ConfigModule, DataModule],
  providers: [QuestsResolver],
})
export class QuestsModule {}
