// tslint:disable variable-name
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class QuestTermConfig {
  @Field(type => Int)
  ID_Config: number;
  @Field(type => Int)
  Type_Influence: number;
  @Field(type => Int)
  Data_Param1: number;
  @Field(type => Int)
  Data_Param2: number;
  @Field(type => Int)
  Data_Param3: number;
  @Field(type => Int)
  Data_Param4: number;
  @Field()
  Data_Expression: string;
}
