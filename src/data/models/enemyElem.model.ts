import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class EnemyElem {
  @Field(type => Int)
  _EnemyElementID: number;
  @Field()
  _EnemyElementName: string;
  @Field()
  _EnemyElementNote: string;
  @Field()
  _EnemyElementDefine: string;
}
