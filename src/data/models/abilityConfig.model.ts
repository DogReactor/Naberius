import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class AbilityConfig {
  @Field(type => Int)
  _ConfigID: number;
  @Field(type => Int)
  _InvokeType: number;
  @Field(type => Int)
  _TargetType: number;
  @Field(type => Int)
  _InfluenceType: number;
  @Field(type => Int)
  _Param1: number;
  @Field(type => Int)
  _Param2: number;
  @Field(type => Int)
  _Param3: number;
  @Field(type => Int)
  _Param4: number;
  @Field()
  _Command: string;
  @Field()
  _ActivateCommand: string;
  @Field()
  ExtendProperty: string;
  @Field()
  NoChangeCondition: string;
}
