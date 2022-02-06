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
import { BattleTalkEvent } from 'data/models/battleTalkEvent.model';
import { BattleTalkEventService } from 'data/battleTalkEvent.service';
import { Enemy } from 'data/models/enemy.model';

@Resolver(Mission)
export class MissionsResolver {
  constructor(
    private readonly missionConfigs: MissionConfigService,
    @Inject('QuestList') private readonly quests: DataFileService<Quest>,
    private readonly battleTalkEvents: BattleTalkEventService,
  ) {}

  @ResolveProperty(type => [Quest])
  Quests(@Parent() mission: Mission) {
    const QuestIDs = this.missionConfigs.getQuestIDs(mission.MissionID);
    console.log(QuestIDs);
    return this.quests.data.filter(quest =>
      QuestIDs.includes(Number.parseInt(quest.QuestID, 10)),
    );
  }

  @ResolveProperty(type => [BattleTalkEvent], { nullable: true })
  async BattleTalkEvents(@Parent() mission: Mission) {
    return this.battleTalkEvents.get(mission.MissionID);
  }

  @Query(type => [Mission])
  Missions() {
    return this.missionConfigs.configs;
  }

  @Query(type => Mission)
  Mission(@Args({ name: 'MissionID', type: () => Int }) MissionID: number) {
    return this.missionConfigs.getMissionByID(MissionID);
  }
}
