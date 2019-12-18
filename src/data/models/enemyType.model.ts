import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class EnemyType {
  @Field(type => Int)
  _EnemyTypeID: number;
  @Field()
  _EnemyTypeName: string;
  @Field()
  _EnemyTypeNote: string;
  @Field()
  _EnemyTypeDefine: string;
}
