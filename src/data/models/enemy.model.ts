// tslint:disable variable-name
import { ObjectType, Field, Int, Float } from 'type-graphql';

@ObjectType()
export class Enemy {
  @Field(type => Int)
  SpecialEffect: number;
  @Field(type => Int)
  PatternID: number;
  @Field(type => Int)
  Type: number;
  @Field(type => Int)
  Attribute: number;
  @Field(type => Int)
  Weather: number;
  @Field(type => Int)
  HP: number;
  @Field(type => Int)
  HP_MAX: number;
  @Field(type => Int)
  ATTACK_POWER: number;
  @Field(type => Int)
  ATTACK_TYPE: number;
  @Field(type => Int)
  ATTACK_RANGE: number;
  @Field(type => Int)
  ATTACK_SPEED: number;
  @Field(type => Int)
  ARMOR_DEFENSE: number;
  @Field(type => Int)
  MAGIC_DEFENSE: number;
  @Field(type => Int)
  MOVE_SPEED: number;
  @Field(type => Int)
  SKILL: number;
  @Field()
  SkyFlag: boolean;
  @Field(type => Int)
  GainCost: number;
  @Field(type => Int)
  EffectHeight: number;
  @Field(type => Int)
  HpGaugeHeight: number;
  @Field(type => Int)
  AttackAnimNo: number;
  @Field()
  BossFlag: boolean;
  @Field(type => Int)
  BgmID: number;
  @Field(type => Float)
  DotRate: number;
  @Field()
  MagicAttack: boolean;
  @Field(type => Int)
  AttackWait: number;
  @Field(type => Int)
  HitEffect: number;
  @Field(type => Int)
  MissileID: number;
  @Field(type => Int)
  DeadEffect: number;
  @Field(type => Int)
  Param_ResistanceAssassin: number;
  @Field(type => Int)
  Param_ChangeParam: number;
  @Field(type => Int)
  Param_ChangeCondition: number;
  @Field({ nullable: true })
  _Attribute: string;
  @Field(type => Int, { nullable: true })
  TypeAttack: number;
  @Field(type => Int, { nullable: true })
  HeightOfs_Paralisys: number;
}
