import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from './config/config.module';
import { FilesModule } from './files/files.module';
import { QuestsModule } from 'quests/quests.module';
import { CardsModule } from 'cards/cards.module';
import { DataModule } from 'data/data.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
    }),
    ConfigModule,
    DataModule,
    FilesModule,
    QuestsModule,
    CardsModule,
  ],
})
export class AppModule {}
