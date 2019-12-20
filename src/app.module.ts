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
        entities: [CardMeta],
        synchronize: true,
      }),
    }),
    DataModule,
    FilesModule,
    QuestsModule,
    CardsModule,
  ],
})
export class AppModule {}
