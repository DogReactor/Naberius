import { ObjectType, Field, Int } from 'type-graphql';

// tslint:disable variable-name
@ObjectType()
export class UnitSpecialtyConfig {
  @Field(type => Int)
  ID_Card: number;
  @Field(type => Int)
  Type_Specialty: number;
  @Field(type => Int)
  Value_Specialty: number;
  @Field(type => Int)
  Value_Param1: number;
  @Field(type => Int)
  Value_Param2: number;
  @Field(type => Int)
  Value_Param3: number;
  @Field(type => Int)
  Value_Param4: number;
  @Field(type => String)
  Command: string;
}
