import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from './config/config.module';
import { FilesModule } from './files/files.module';
import { QuestsModule } from 'quests/quests.module';
import { CardsModule } from 'cards/cards.module';
import { DataModule } from 'data/data.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'config/config.service';
import { CardMeta } from 'data/models/cardMeta.model';
import { ClassMeta } from 'data/models/classMeta.model';
import { PostersModule } from 'posters/posters.module';
import { ScheduleModule } from '@nestjs/schedule';
import { File } from 'data/models/file.model';

@Module({
  imports: [
    ConfigModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mongodb',
        host: config.get('MONGO_HOST'),
        port: Number.parseInt(config.get('MONGO_PORT'), 10),
        database: config.get('MONGO_DATABASE'),
        entities: [CardMeta, ClassMeta, File],
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
