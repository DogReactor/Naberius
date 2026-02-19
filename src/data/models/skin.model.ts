import { ObjectType, Field, Int, } from 'type-graphql';

@ObjectType()
export class Skin {
  @Field(type => Int)
  rowid: number;
  @Field(type => Int)
  FaceId: number;
  @Field(type => Int)
  FreeCondition: number;
  @Field(type => Int)
  FaceId_RarityGroup01: number;
  @Field(type => Int)
  FaceId_RarityGroup02: number;
  @Field(type => Int)
  FaceId_RarityGroup03: number;
  @Field(type => Int)
  FaceId_RarityGroup04: number;
  @Field(type => Int)
  FaceId_RarityGroup05: number;
  @Field(type => Int)
  FaceId_RarityGroup06: number;
  @Field(type => Int)
  FaceId_RarityGroup08: number;
  @Field(type => Int)
  IllustratorR18: number;
}

@ObjectType()
export class SkinUnit {
  @Field(type => Int)
  cardID: number;
  @Field()
  name: string;
  @Field(type => Int)
  rarity: number;
}
