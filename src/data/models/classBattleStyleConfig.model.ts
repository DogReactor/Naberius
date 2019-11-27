// tslint:disable variable-name
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class ClassBattleStyleConfig {
  @Field(type => Int)
  Data_ID: number;
  @Field(type => Int)
  Type_BattleStyle: number;
  @Field(type => Int)
  _Param_01: number;
  @Field(type => Int)
  _Param_02: number;
  @Field(type => Int)
  _Range_01: number;
  @Field(type => Int)
  _Range_02: number;
  @Field(type => Int)
  _Range_03: number;
  @Field(type => Int)
  _Range_04: number;
  @Field(type => Int)
  _Range_05: number;
}
