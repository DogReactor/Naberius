import { Resolver, Query, Args } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { DataFileService } from 'data/dataFile.service';
import { Quest } from 'data/models/quest.model';
import { Int } from 'type-graphql';

@Resolver(Quest)
export class QuestsResolver {
  constructor(
    @Inject('QuestList') private readonly questList: DataFileService<Quest>,
  ) {}

  @Query(returns => [Quest])
  quests() {
    return this.questList.data;
  }

  @Query(returns => Quest, { nullable: true })
  quest(@Args({ name: 'QuestID', type: () => Int }) QuestID: number) {
    return this.questList.data.find(quest => quest.QuestID === QuestID);
  }
}
