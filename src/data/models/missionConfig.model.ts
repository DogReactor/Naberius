import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class MissionConfig {
  @Field(type => Int)
  MissionID: number;
  @Field({ nullable: true })
  Name?: string;
  @Field(type => Int, { nullable: true })
  Enable?: number;
  StartDateTime?: null;
  EndDateTime?: null;
  @Field(type => Int, { nullable: true })
  TagID?: number;
  @Field(type => Int, { nullable: true })
  TagIDRange?: number;
  @Field(type => Int, { nullable: true })
  UseInformationButton?: number;
  @Field(type => Int, { nullable: true })
  DisplayOrder?: number;

  // emegency
  @Field(type => Int, { nullable: true })
  TrialCardID?: number;
  @Field(type => Int, { nullable: true })
  IncentiveType?: number;
  @Field(type => Int, { nullable: true })
  IncentiveCardID?: number;
  @Field({ nullable: true })
  EventItemName?: string;

  // reproduce
  @Field(type => Int, { nullable: true })
  UseEndText?: number;

  // story
  @Field(type => Int, { nullable: true })
  ButtonTextureID?: number;
  @Field(type => Int, { nullable: true })
  KeyQuestID?: number;

  // daily reproduce
  @Field(type => Int, { nullable: true })
  TitleID?: number;
  @Field({ nullable: true })
  QuestID?: string;
  @Field({ nullable: true })
  FaceIconID?: string;

  // tower
  @Field({ nullable: true })
  TowerCrystalID?: string;
  @Field({ nullable: true })
  ConsumeItemID?: string;
  @Field(type => Int, { nullable: true })
  DailyAutoAddCount?: number;
  @Field(type => Int, { nullable: true })
  TopFloor?: number;
}
