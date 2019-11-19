import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from './config/config.module';
import { FilesModule } from './files/files.module';
import { QuestsModule } from 'quests/quests.module';
import { CardsModule } from 'cards/cards.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'src/schema.gql',
    }),
    ConfigModule,
    FilesModule,
    QuestsModule,
    CardsModule,
  ],
})
export class AppModule {}
