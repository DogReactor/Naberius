import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class Missile {
  @Field(type => Int)
  PatternID: number;
  @Field(type => Int)
  Enemy: number;
  @Field(type => Int)
  Speed: number;
  @Field(type => Int)
  YOffset: number;
  @Field(type => Int)
  MaxHeight: number;
  @Field(type => Int)
  XOffset: number;
  @Field(type => Int)
  MaxWidth: number;
  @Field(type => Int)
  DamageArea: number;
  @Field(type => Int)
  SlowTime: number;
  @Field(type => Int)
  SlowRate: number;
  @Field(type => Int)
  HitEffect: number;
  @Field(type => Int)
  ExplosionEffect: number;
  @Field(type => Int)
  DisableRotation: number;
  @Field(type => Int)
  InterruptFlip: number;
  @Field(type => Int)
  _CastType: number;
  @Field()
  Property: string;
}
