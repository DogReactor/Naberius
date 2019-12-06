import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class SkillsWithType {
  @Field()
  Type: 'Init' | 'CC' | 'Evo';

  initSkillID: number;
}
