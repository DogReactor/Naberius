import { Module } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { DataModule } from 'data/data.module';
import { CardsResolver } from './cards.resolver';
import { SkillsResolver } from './skills.resolver';
import { SkillsWithTypeResolver } from './skillsWithType.resolver';

@Module({
  imports: [ConfigModule, DataModule],
  providers: [CardsResolver, SkillsResolver, SkillsWithTypeResolver],
})
export class CardsModule {}
