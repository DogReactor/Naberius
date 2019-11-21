import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class SkillsWithType {
  @Field()
  Type: string;

  initSkillID: number;
}
