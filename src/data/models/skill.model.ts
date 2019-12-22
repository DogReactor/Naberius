import { ObjectType, Field, Int } from 'type-graphql';
import { SkillInfluenceConfig } from './skillInfluenceConfig.model';

// tslint:disable variable-name
@ObjectType()
export class Skill {
  index: number;
  @Field()
  SkillName: string;
  @Field(type => Int)
  WaitTime: number;
  @Field(type => Int)
  ContTime: number;
  @Field(type => Int)
  ContTimeMax: number;
  @Field(type => Int)
  Power: number;
  @Field(type => Int)
  PowerMax: number;
  @Field(type => Int)
  LevelMax: number;
  @Field(type => Int)
  Evolve: number;
  @Field(type => Int)
  SkillType: number;
  @Field(type => Int)
  ID_Text: number;

  @Field(type => [SkillInfluenceConfig])
  Configs?: SkillInfluenceConfig[];
}
