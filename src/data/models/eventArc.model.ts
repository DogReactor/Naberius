import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class EventArc {
  @Field(type => Int)
  _TextID: number;
  @Field(type => Int)
  _FaceID: number;
  @Field()
  _TalkerName: string;
  @Field()
  _TalkText: string;
}
