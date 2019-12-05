import { ObjectType, Field, Int } from 'type-graphql';
import { MissionConfig } from './missionConfig.model';

@ObjectType()
export class Quest {
  @Field(type => Int)
  QuestID: number;
  @Field(type => Int)
  QuestTitle: number;
  @Field(type => Int)
  Text: number;
  @Field(type => Int)
  Type: number;
  @Field(type => Int)
  Charisma: number;
  @Field(type => Int)
  ActionPoint: number;
  @Field(type => Int)
  Rank: number;
  @Field(type => Int)
  Level: number;
  @Field(type => Int)
  Capacity: number;
  @Field(type => Int)
  defHP: number;
  @Field(type => Int)
  defAP: number;
  @Field(type => Int)
  AppearCondition: number;
  @Field(type => Int)
  RankExp: number;
  @Field(type => Int)
  Gold: number;
  @Field(type => Int)
  MapNo: number;
  @Field(type => Int)
  EntryNo: number;
  @Field(type => Int)
  Treasure1: number;
  @Field(type => Int)
  Treasure2: number;
  @Field(type => Int)
  Treasure3: number;
  @Field(type => Int)
  Treasure4: number;
  @Field(type => Int)
  Treasure5: number;
  @Field(type => Int)
  UnitLevel: number;
  @Field(type => Int)
  QuestTerms: number;
  @Field(type => Int)
  LocationNo: number;
  @Field(type => Int)
  StartOpenDay: number;
  @Field(type => Int)
  EndOpenDay: number;
  @Field(type => Int)
  OpenWeek: number;
  @Field(type => Int)
  BonusType: number;
  @Field(type => Int)
  BonusNum: number;
  @Field(type => Int)
  UnitList: number;
  @Field(type => Int)
  _HardLevel: number;
  @Field(type => Int)
  _HardCondition: number;
  @Field(type => Int)
  _HardInfomation: number;
  @Field(type => Int)
  _DispIndex: number;
  @Field(type => Int)
  _HoldingParam: number;
  @Field(type => Int)
  DangerArea: number;
}
