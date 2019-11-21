import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType('Card')
export class CardSchema {
  @Field(type => Int)
  CardID: number;
  @Field(type => Int)
  InitClassID: number;
  @Field(type => Int)
  ClassLV0SkillID: number;
  @Field(type => Int)
  ClassLV1SkillID: number;
  @Field(type => Int)
  EvoSkillID: number;
  @Field(type => Int)
  Kind: number;
  @Field(type => Int)
  Rare: number;
  @Field(type => Int)
  DotID0: number;
  @Field(type => Int)
  DotID1: number;
  @Field(type => Int)
  DotID2: number;
  @Field(type => Int)
  SellPrice: number;
  @Field(type => Int)
  BuildExp: number;
  @Field(type => Int)
  LoveEv1: number;
  @Field(type => Int)
  BonusType: number;
  @Field(type => Int)
  BonusNum: number;
  @Field(type => Int)
  BonusType2: number;
  @Field(type => Int)
  BonusNum2: number;
  @Field(type => Int)
  BonusType3: number;
  @Field(type => Int)
  BonusNum3: number;
  @Field(type => Int)
  DeadVoice: number;
  @Field(type => Int)
  DotScale: number;
  @Field(type => Int)
  EffectHeight: number;
  @Field(type => Int)
  CostModValue: number;
  @Field(type => Int)
  CostDecValue: number;
  @Field(type => Int)
  MaxHPMod: number;
  @Field(type => Int)
  AtkMod: number;
  @Field(type => Int)
  DefMod: number;
  @Field(type => Int)
  GachaPicture: number;
  @Field(type => Int)
  GachaStartX: number;
  @Field(type => Int)
  GachaStartY: number;
  @Field(type => Int)
  GachaEndX: number;
  @Field(type => Int)
  GachaEndY: number;
  @Field(type => Int)
  GachaScale: number;
  @Field(type => Int)
  Event1BGM: number;
  @Field(type => Int)
  Event2BGM: number;
  @Field(type => Int)
  Flavor: number;
  @Field(type => Int)
  Flavor2: number;
  @Field(type => Int)
  Illust: number;
  @Field(type => Int)
  MagicResistance: number;
  @Field(type => Int)
  Ability: number;
  @Field(type => Int)
  Ability_Default: number; // tslint:disable-line variable-name
  @Field(type => Int)
  FullShot1: number;
  @Field(type => Int)
  Face1: number;
  @Field(type => Int)
  PlatformType: number;
  @Field(type => Int)
  PlatformTypeAwakening: number;
  @Field(type => Int)
  PlatformTypeSkillAwakening: number;
  @Field(type => Int)
  _TypeRace: number;
  @Field(type => Int)
  _TradePoint: number;
  @Field(type => Int)
  _AppearAbilityLevel: number;
  @Field(type => Int)
  _AwakePattern: number;
  @Field(type => Int)
  DotID3: number;
  @Field(type => Int)
  DotID4: number;
  @Field(type => Int)
  CharaImage3: number;
  @Field(type => Int)
  CharaFace3: number;
  @Field(type => Int)
  CharaImage4: number;
  @Field(type => Int)
  CharaFace4: number;
  @Field(type => Int)
  PlatformTypeAwakening2: number;
  @Field(type => Int)
  Assign: number;
  @Field(type => Int)
  Genus: number;
  @Field(type => Int)
  Identity: number;
  @Field(type => Int)
  Blood: number;
  @Field(type => Int)
  HomeCooking: number;
  @Field(type => Int)
  ChildCardID: number;
  @Field(type => Int)
  OriginID: number;
  @Field(type => Int)
  RootsID: number;

  @Field({ nullable: true })
  Name: string;

  @Field(type => [String])
  ImageStand: string[];

  @Field(type => [String])
  ImageCG: string[];

  @Field(type => String, { nullable: true })
  IllustName?: string;

  @Field({ nullable: true })
  RaceName?: string;

  @Field({ nullable: true })
  AssignName?: string;

  @Field({ nullable: true })
  IdentityName?: string;
}
