import { Module } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { DataModule } from 'data/data.module';
import { CardsResolver } from './cards.resolver';
import { SkillsResolver } from './skills.resolver';
import { SkillsWithTypeResolver } from './skillsWithType.resolver';
import { ClassesResolver } from './classes.resolver';
import { AbilitiesResolver } from './abilities.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardMeta } from 'data/models/cardMeta.model';
import { ClassMeta } from 'data/models/classMeta.model';
import { File } from 'data/models/file.model';
import { SkillConfigMeta } from 'data/models/skillConfigMeta.model';
import { LoggerModule } from 'logger/logger.module';
import { SkillConfigsResolver } from './skillConfigs.resolver';
import { AbilityConfigsResolver } from './abilityConfigs.resolver';
import { AbilityConfigMeta } from 'data/models/abilityConfigMeta.model';
import { UnitConfigMeta } from 'data/models/unitConfigMeta.model';
import { UnitSpecialtyConfigsResolver } from './unitSpecialtyConfigs.resolver';
import { SkinResolver } from './skin.resolver';

@Module({
  imports: [
    ConfigModule,
    DataModule,
    TypeOrmModule.forFeature([
      CardMeta,
      ClassMeta,
      File,
      SkillConfigMeta,
      AbilityConfigMeta,
      UnitConfigMeta,
    ]),
    LoggerModule,
  ],
  providers: [
    CardsResolver,
    SkillsResolver,
    SkillsWithTypeResolver,
    AbilitiesResolver,
    ClassesResolver,
    SkillConfigsResolver,
    AbilityConfigsResolver,
    UnitSpecialtyConfigsResolver,
    SkinResolver,
  ],
})
export class CardsModule {}
