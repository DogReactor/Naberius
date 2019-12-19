import { ObjectType, Field, Int, Float } from 'type-graphql';

@ObjectType()
export class Sprite {
  @Field(type => Int)
  X: number;
  @Field(type => Int)
  Y: number;
  @Field(type => Int)
  Width: number;
  @Field(type => Int)
  Height: number;
  @Field(type => Int)
  OriginX: number;
  @Field(type => Int)
  OriginY: number;
}

@ObjectType()
class PatternNo {
  @Field(type => Int, { nullable: true })
  Time?: number;
  @Field(type => Int)
  Data: number;
}

@ObjectType()
export class PosData {
  @Field(type => Float)
  X: number;
  @Field(type => Float)
  Y: number;
  @Field(type => Float)
  Z: number;
}
@ObjectType()
class Pos {
  @Field(type => Int, { nullable: true })
  Time?: number;
  @Field(type => PosData)
  Data: PosData;
}

@ObjectType()
export class ScaleData {
  @Field(type => Float)
  X: number;
  @Field(type => Float)
  Y: number;
  @Field(type => Float)
  Z: number;
}
@ObjectType()
export class Scale {
  @Field(type => Int, { nullable: true })
  Time?: number;
  @Field(type => ScaleData)
  Data: ScaleData;
}

@ObjectType()
export class Alpha {
  @Field(type => Int, { nullable: true })
  Time?: number;
  @Field(type => Float)
  Data: number;
}

@ObjectType()
export class DotEntry {
  @Field()
  Name: string;
  @Field(type => [Sprite])
  Sprites: Sprite[];
  @Field(type => [PatternNo], { nullable: true })
  PatternNo?: PatternNo[];
  @Field(type => [Pos], { nullable: true })
  Pos?: Pos[];
  @Field(type => [Scale], { nullable: true })
  Scale?: Scale[];
  @Field(type => [Alpha], { nullable: true })
  Alpha?: Alpha[];
}

@ObjectType()
export class Dot {
  @Field()
  Name: string;
  @Field(type => Int)
  Length: number;
  @Field(type => [DotEntry])
  Entries: DotEntry[];
}
