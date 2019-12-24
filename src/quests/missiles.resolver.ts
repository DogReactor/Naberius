import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { Missile } from 'data/models/missile.model';
import { CacheFileService } from 'data/cacheFile.service';
import { Inject } from '@nestjs/common';
import { Int } from 'type-graphql';

@Resolver(Missile)
export class MissilesResolver {
  constructor(
    @Inject('Missile')
    private readonly missiles: CacheFileService<Missile>,
  ) {}

  @ResolveProperty(type => Int)
  MissileID(@Parent() missile: Missile) {
    return missile.index;
  }

  @Query(type => [Missile])
  Missiles() {
    return this.missiles.data;
  }

  @Query(type => Missile, { nullable: true })
  Missile(@Args({ name: 'MissileID', type: () => Int }) MissileID: number) {
    return this.missiles.data[MissileID];
  }
}
