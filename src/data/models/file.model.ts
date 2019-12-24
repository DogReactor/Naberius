import { ObjectType, Field } from 'type-graphql';
import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';

@ObjectType()
@Entity()
export class File {
  @ObjectIdColumn()
  id: ObjectID;

  @Field()
  @Column()
  Name: string;

  @Field()
  @Column()
  Link: string;

  @Field(type => Date)
  @Column(type => Date)
  UpdateTime: Date;
}
