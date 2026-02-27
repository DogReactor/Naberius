import { ObjectType, Field, Int, Float } from 'type-graphql';

@ObjectType()
export class Missile {
  index: number;
  @Field(type => Int)
  PatternID: number;
  @Field(type => Int)
  Enemy: number;
  @Field(type => Float)
  Speed: number;
  @Field(type => Float)
  YOffset: number;
  @Field(type => Float)
  MaxHeight: number;
  @Field(type => Float)
  MinHeight: number;
  @Field(type => Float)
  XOffset: number;
  @Field(type => Float)
  MaxWidth: number;
  @Field(type => Float)
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
  EffectSizeFix: number;
  @Field(type => Int)
  DisableRotation: number;
  @Field(type => Int)
  InterruptFlip: number;
  @Field(type => Int)
  _CastType: number;
  @Field(type => Int)
  HealType: number;
  @Field(type => Int)
  PenetrateType: number;
  @Field(type => Int)
  ColDiameter: number;
  @Field()
  Property: string;
  @Field(type => Int)
  BlastResidueTime: number;
  @Field(type => Int)
  BlastResidueInterval: number;
}
