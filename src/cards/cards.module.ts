import { Module } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { DataModule } from 'data/data.module';
import { CardsResolver } from './cards.resolver';

@Module({
  imports: [ConfigModule, DataModule],
  providers: [CardsResolver],
})
export class CardsModule {}
