import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
export class Card {
  @Field()
  CardID: string;
  @Field()
  InitClassID: string;
  @Field()
  ClassLV0SkillID: string;
  @Field()
  ClassLV1SkillID: string;
  @Field()
  EvoSkillID: string;
  @Field()
  Kind: string;
  @Field()
  Rare: string;
  @Field()
  DotID0: string;
  @Field()
  DotID1: string;
  @Field()
  DotID2: string;
  @Field()
  SellPrice: string;
  @Field()
  BuildExp: string;
  @Field()
  LoveEv1: string;
  @Field()
  BonusType: string;
  @Field()
  BonusNum: string;
  @Field()
  BonusType2: string;
  @Field()
  BonusNum2: string;
  @Field()
  BonusType3: string;
  @Field()
  BonusNum3: string;
  @Field()
  DeadVoice: string;
  @Field()
  DotScale: string;
  @Field()
  EffectHeight: string;
  @Field()
  CostModValue: string;
  @Field()
  CostDecValue: string;
  @Field()
  MaxHPMod: string;
  @Field()
  AtkMod: string;
  @Field()
  DefMod: string;
  @Field()
  GachaPicture: string;
  @Field()
  GachaStartX: string;
  @Field()
  GachaStartY: string;
  @Field()
  GachaEndX: string;
  @Field()
  GachaEndY: string;
  @Field()
  GachaScale: string;
  @Field()
  Event1BGM: string;
  @Field()
  Event2BGM: string;
  @Field()
  Flavor: string;
  @Field()
  Flavor2: string;
  @Field()
  Illust: string;
  @Field()
  MagicResistance: string;
  @Field()
  Ability: string;
  @Field()
  Ability_Default: string; // tslint:disable-line variable-name
  @Field()
  FullShot1: string;
  @Field()
  Face1: string;
  @Field()
  PlatformType: string;
  @Field()
  PlatformTypeAwakening: string;
  @Field()
  PlatformTypeSkillAwakening: string;
  @Field()
  _TypeRace: string;
  @Field()
  _TradePoint: string;
  @Field()
  _AppearAbilityLevel: string;
  @Field()
  _AwakePattern: string;
  @Field()
  DotID3: string;
  @Field()
  DotID4: string;
  @Field()
  CharaImage3: string;
  @Field()
  CharaFace3: string;
  @Field()
  CharaImage4: string;
  @Field()
  CharaFace4: string;
  @Field()
  PlatformTypeAwakening2: string;
  @Field()
  Assign: string;
  @Field()
  Genus: string;
  @Field()
  Identity: string;
  @Field()
  Identity2: string;
  @Field()
  Identity3: string;
  @Field()
  Identity4: string;
  @Field()
  Identity5: string;
  @Field()
  Identity6: string;
  @Field()
  Blood: string;
  @Field()
  HomeCooking: string;
  @Field()
  ChildCardID: string;
  @Field()
  OriginID: string;
  @Field()
  RootsID: string;
}
