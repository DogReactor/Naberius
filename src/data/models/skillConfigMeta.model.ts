import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
@Entity()
export class SkillConfigMeta {
  @ObjectIdColumn()
  id: ObjectID;

  @Field(type => Int)
  @Column('int', { nullable: false })
  TypeID: number;

  @Field({ nullable: true })
  @Column()
  Comment: string;
}
