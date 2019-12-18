import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class QuestEventText {
  @Field()
  Message: string;
  @Field()
  Name: string;
  @Field(type => Int)
  FaceID: number;
}
