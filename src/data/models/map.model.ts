import { ObjectType, Field, Int } from 'type-graphql';
import { Enemy } from './enemy.model';

@ObjectType()
export class Map {
  @Field(type => Int)
  MapID: number;
  @Field(type => [[Entry]], { nullable: 'items' })
  Entries: Entry[][] = [];
  @Field(type => [[Location]], { nullable: 'items' })
  Locations: Location[][] = [];
  @Field(type => [[Route]], { nullable: 'items' })
  Routes: Route[][] = [];
  @Field(type => [Enemy], { nullable: true })
  Enemies?: Enemy[];
  @Field()
  MapName: string;
}

@ObjectType()
export class Entry {
  @Field(type => Int)
  EnemyID: number;
  @Field(type => Int)
  Wait: number;
  @Field(type => Int)
  RouteNo: number;
  @Field(type => Int)
  Loop: number;
  @Field(type => Int)
  Level: number;
  @Field(type => Int)
  PrizeEnemySpawnPercent: number;
  @Field(type => Int)
  PrizeCardID: number;
  @Field(type => Int)
  PrizeEnemyDropPercent: number;
  @Field(type => Int)
  RouteOffset: number;
  @Field({ nullable: true })
  IsAppear?: string;
  @Field({ nullable: true })
  FreeCommand?: string;
  @Field({ nullable: true })
  EntryCommand?: string;
  @Field({ nullable: true })
  DeadCommand?: string;
}

@ObjectType()
export class Location {
  @Field(type => Int)
  ObjectID: number;
  @Field(type => Int)
  X: number;
  @Field(type => Int)
  Y: number;
  @Field({ nullable: true })
  _Command: string;
}

@ObjectType()
export class Route {
  @Field(type => Int)
  X: number;
  @Field(type => Int)
  Y: number;
  @Field(type => Int)
  RouteID: number;
  @Field(type => Int)
  JumpPoint: number;
  @Field(type => Int)
  WarpDelay: number;
  @Field(type => Int)
  WaitTime: number;
  @Field(type => Int)
  SpeedModify: number;
  @Field({ nullable: true })
  OnEvent: string;
}
