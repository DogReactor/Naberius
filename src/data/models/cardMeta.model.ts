import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
@Entity()
export class CardMeta {
  @ObjectIdColumn()
  id: ObjectID;

  @Field(type => Int)
  @Column('int', { nullable: false })
  CardID: number;

  @Field(type => [String], { nullable: true })
  @Column()
  NickNames: string[];

  @Field({ nullable: true })
  @Column()
  ConneName: string;
}
