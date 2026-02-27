// tslint:disable variable-name
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class SkillInfluenceConfig {
  @Field(type => Int)
  Data_ID: number;
  @Field(type => Int)
  Type_Collision: number;
  @Field(type => Int)
  Type_CollisionState: number;
  @Field(type => Int)
  Type_ChangeFunction: number;
  @Field(type => Int)
  Data_Target: number;
  @Field(type => Int)
  Data_InfluenceType: number;
  @Field(type => Int)
  Data_MulValue: number;
  @Field(type => Int)
  Data_MulValue2: number;
  @Field(type => Int)
  Data_MulValue3: number;
  @Field(type => Int)
  Data_AddValue: number;
  @Field()
  _Expression: string;
  @Field()
  _ExpressionActivate: string;
  @Field()
  _ExpressionActivateTarget: string;
  @Field(type => Int)
  _HoldRatioUpperLimit: number;
  @Field()
  ExtendProperty: string;
}
