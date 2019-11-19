import { ObjectType, Field } from 'type-graphql';

@ObjectType('File')
export class FileSchema {
  @Field()
  Name: string;

  @Field()
  Link: string;
}
