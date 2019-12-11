import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { DataFileService } from 'data/dataFile.service';
import { Quest } from 'data/models/quest.model';
import { Int } from 'type-graphql';
import { Mission } from 'data/models/missionConfig.model';
import { MissionConfigService } from 'data/missionConfig.service';
import { QuestNameTextService } from 'data/questNameText.service';

@Resolver(Quest)
export class QuestsResolver {
  constructor(
    @Inject('QuestList') private readonly questList: DataFileService<Quest>,
    private readonly missionConfigs: MissionConfigService,
    private readonly questNameTexts: QuestNameTextService,
  ) {}

  @ResolveProperty(type => Mission, { nullable: true })
  Mission(@Parent() quest: Quest) {
    return this.missionConfigs.getMissionByQuestID(quest.QuestID);
  }

  @ResolveProperty(type => String, { nullable: true })
  async Name(@Parent() quest: Quest) {
    const mission = this.Mission(quest);
    if (mission) {
      const texts = await this.questNameTexts.get(mission.MissionID);
      if (texts) {
        return texts[quest.QuestTitle].Message;
      }
    }
  }

  @Query(returns => Quest, { nullable: true })
  quest(@Args({ name: 'QuestID', type: () => Int }) QuestID: number) {
    return this.questList.data.find(quest => quest.QuestID === QuestID);
  }
}
