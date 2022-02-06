import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class Quest {
  @Field()
  QuestID: string;
  @Field()
  QuestTitle: string;
  @Field()
  Text: string;
  @Field()
  Type: string;
  @Field()
  Charisma: string;
  @Field()
  ActionPoint: string;
  @Field()
  Rank: string;
  @Field()
  Level: string;
  @Field()
  Capacity: string;
  @Field()
  defHP: string;
  @Field()
  defAP: string;
  @Field()
  AppearCondition: string;
  @Field()
  RankExp: string;
  @Field()
  Gold: string;
  @Field()
  MapNo: string;
  @Field()
  EntryNo: string;
  @Field()
  Treasure1: string;
  @Field()
  Treasure2: string;
  @Field()
  Treasure3: string;
  @Field()
  Treasure4: string;
  @Field()
  Treasure5: string;
  @Field()
  UnitLevel: string;
  @Field()
  QuestTerms: string;
  @Field()
  LocationNo: string;
  @Field()
  StartOpenDay: string;
  @Field()
  EndOpenDay: string;
  @Field()
  OpenWeek: string;
  @Field()
  BonusType: string;
  @Field()
  BonusNum: string;
  @Field()
  UnitList: string;
  @Field()
  _HardLevel: string;
  @Field()
  _HardCondition: string;
  @Field()
  _HardInfomation: string;
  @Field()
  _DispIndex: string;
  @Field()
  _HoldingParam: string;
  @Field()
  DangerArea: string;
}
