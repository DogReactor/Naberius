import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from './config/config.module';
import { FilesModule } from './files/files.module';
import { QuestsModule } from 'quests/quests.module';
import { CardsModule } from 'cards/cards.module';
import { DataModule } from 'data/data.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParsedConfigService } from 'config/config.service';
import { CardMeta } from 'data/models/cardMeta.model';
import { ClassMeta } from 'data/models/classMeta.model';
import { PostersModule } from 'posters/posters.module';
import { ScheduleModule } from '@nestjs/schedule';
import { File } from 'data/models/file.model';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { SkillConfigMeta } from 'data/models/skillConfigMeta.model';
import { AbilityConfigMeta } from 'data/models/abilityConfigMeta.model';
import { EnemyConfigMeta } from 'data/models/enemyConfigMeta.model';
import { QuestConfigMeta } from 'data/models/questConfigMeta.model';

@Module({
  imports: [
    NestConfigModule.forRoot(),
    ConfigModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ParsedConfigService],
      useFactory: (config: ParsedConfigService) => ({
        type: 'mongodb',
        host: config.get('MONGO_HOST'),
        port: Number.parseInt(config.get('MONGO_PORT'), 10),
        database: config.get('MONGO_DATABASE'),
        entities: [
          CardMeta,
          ClassMeta,
          File,
          SkillConfigMeta,
          AbilityConfigMeta,
          EnemyConfigMeta,
          QuestConfigMeta,
        ],
        synchronize: true,
      }),
    }),
    ScheduleModule.forRoot(),
    DataModule,
    FilesModule,
    QuestsModule,
    CardsModule,
    PostersModule,
  ],
})
export class AppModule {}
