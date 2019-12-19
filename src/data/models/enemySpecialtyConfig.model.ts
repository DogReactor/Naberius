// tslint:disable variable-name
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class EnemySpecialtyConfig {
  @Field(type => Int)
  ID_Config: number;
  @Field(type => Int)
  Type_Influence: number;
  @Field(type => Int)
  Param_1: number;
  @Field(type => Int)
  Param_2: number;
  @Field(type => Int)
  Param_3: number;
  @Field(type => Int)
  Param_4: number;
  @Field()
  _Expression: string;
  @Field()
  _ExtParam: string;
}
