// tslint:disable variable-name
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class Class {
  @Field(type => Int)
  ClassID: number;
  @Field()
  Name: string;
  @Field(type => Int)
  MaxLevel: number;
  @Field(type => Int)
  Cost: number;
  @Field(type => Int)
  InitHP: number;
  @Field(type => Int)
  MaxHP: number;
  @Field(type => Int)
  AttackType: number;
  @Field(type => Int)
  InitAtk: number;
  @Field(type => Int)
  MaxAtk: number;
  @Field(type => Int)
  MaxTarget: number;
  @Field(type => Int)
  InitDef: number;
  @Field(type => Int)
  MaxDef: number;
  @Field(type => Int)
  AtkSpeedCorrection: number;
  @Field(type => Int)
  AtkArea: number;
  @Field(type => Int)
  JobChange: number;
  @Field(type => Int)
  JobChangeMaterial1: number;
  @Field(type => Int)
  JobChangeMaterial2: number;
  @Field(type => Int)
  JobChangeMaterial3: number;
  @Field(type => Int)
  Data_ExtraAwakeOrb1: number;
  @Field(type => Int)
  Data_ExtraAwakeOrb2: number;
  @Field(type => Int)
  Dot: number;
  @Field(type => Int)
  MissileID: number;
  @Field(type => Int)
  ApproachFlag: number;
  @Field(type => Int)
  BlockNum: number;
  @Field(type => Int)
  DotNo: number;
  @Field(type => Int)
  AttackWait: number;
  @Field(type => Int)
  AttackAnimNo: number;
  @Field(type => Int)
  BuildExp: number;
  @Field(type => Int)
  HpGaugeHeight: number;
  @Field(type => Int)
  AttackAttribute: number;
  @Field(type => Int)
  HitEffect: number;
  @Field()
  Explanation: string;
  @Field(type => Int)
  ClassAbility1: number;
  @Field(type => Int)
  ClassAbilityPower1: number;
  @Field(type => Int)
  AwakeType1: number;
  @Field(type => Int)
  AwakeType2: number;
  @Field(type => Int)
  _LowRareEvolveMaterial_01: number;
  @Field(type => Int)
  _LowRareEvolveMaterial_02: number;
  @Field(type => Int)
  _LowRareEvolveMaterial_03: number;
  @Field(type => Int)
  SortGroupID: number;
  @Field()
  DisplayPermission: string;

  @Field({ nullable: true })
  Type?: 'Init' | 'CC' | 'Evo' | 'Evo2a' | 'Evo2b';
}
