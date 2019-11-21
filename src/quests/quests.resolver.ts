import { Resolver, Query, Args } from '@nestjs/graphql';
import { QuestSchema } from './schemas/quest.schema';
import { Inject } from '@nestjs/common';
import { DataFileService } from 'data/dataFile.service';
import { Quest } from 'data/models/quest.model';
import { Int } from 'type-graphql';

@Resolver(QuestSchema)
export class QuestsResolver {
  constructor(
    @Inject('QuestList') private readonly questList: DataFileService<Quest>,
  ) {}

  @Query(returns => [QuestSchema])
  quests() {
    return this.questList.data;
  }

  @Query(returns => QuestSchema, { nullable: true })
  quest(@Args({ name: 'QuestID', type: () => Int }) QuestID: number) {
    return this.questList.data.find(quest => quest.QuestID === QuestID);
  }
}
