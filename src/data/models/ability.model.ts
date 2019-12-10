import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class Ability {
  @Field()
  AbilityName: string;
  @Field(type => Int)
  AbilityPower: number;
  @Field(type => Int)
  AbilityType: number;
  @Field(type => Int)
  AbilityTextID: number;
  @Field(type => Int)
  _ConfigID: number;
  AbilityText: null;
  @Field(type => Int)
  AbilityID: number;

  @Field({ nullable: true })
  Type?: 'Init' | 'Evo';
}
