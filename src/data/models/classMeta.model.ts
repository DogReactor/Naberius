import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';
import { ObjectID } from 'mongodb';

@ObjectType()
@Entity()
export class ClassMeta {
  @ObjectIdColumn()
  id: ObjectID;

  @Field(type => Int)
  @Column('int', { nullable: false })
  ClassID: number;

  @Field(type => [String], { nullable: true })
  @Column()
  NickNames: string[];
}
