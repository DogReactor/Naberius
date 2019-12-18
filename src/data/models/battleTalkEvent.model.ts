import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class BattleTalkEvent {
  @Field({ nullable: true })
  Message: string;
  @Field({ nullable: true })
  Name: string;
  @Field(type => Int)
  FaceID: number;
  @Field(type => Int)
  RecordOffset: number;

  @Field(type => Int)
  RecordIndex?: number;
}
