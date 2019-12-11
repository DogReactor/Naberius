import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { Mission } from 'data/models/missionConfig.model';
import { MissionConfigService } from 'data/missionConfig.service';
import { Quest } from 'data/models/quest.model';
import { Inject } from '@nestjs/common';
import { DataFileService } from 'data/dataFile.service';
import { Int } from 'type-graphql';

@Resolver(Mission)
export class MissionsResolver {
  constructor(
    private readonly missionConfigs: MissionConfigService,
    @Inject('QuestList') private readonly quests: DataFileService<Quest>,
  ) {}

  @ResolveProperty(type => [Quest])
  Quests(@Parent() mission: Mission) {
    const QuestIDs = this.missionConfigs.getQuestIDs(mission.MissionID);
    return this.quests.data.filter(quest => QuestIDs.includes(quest.QuestID));
  }

  @Query(type => [Mission])
  missions() {
    return this.missionConfigs.configs;
  }

  @Query(type => Mission)
  mission(@Args({ name: 'MissionID', type: () => Int }) MissionID: number) {
    return this.missionConfigs.getMissionByID(MissionID);
  }
}
