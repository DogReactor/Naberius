import { Resolver, ResolveProperty, Parent } from '@nestjs/graphql';
import { Enemy } from 'data/models/enemy.model';
import { Inject } from '@nestjs/common';
import { CacheFileService } from 'data/cacheFile.service';
import { EnemyType } from 'data/models/enemyType.model';
import { EnemyElem } from 'data/models/enemyElem.model';
import { DotService } from 'data/dot.service';
import { Dot } from 'data/models/dot.model';

@Resolver(Enemy)
export class EnemyResolver {
  constructor(
    @Inject('EnemyType')
    private readonly enemyTypes: CacheFileService<EnemyType>,
    @Inject('EnemyElem')
    private readonly enemyElems: CacheFileService<EnemyElem>,
    private readonly dots: DotService,
  ) {}

  @ResolveProperty(type => EnemyType)
  EnemyType(@Parent() enemy: Enemy) {
    return this.enemyTypes.data[enemy.Type];
  }

  @ResolveProperty(type => EnemyElem)
  EnemyElem(@Parent() enemy: Enemy) {
    return this.enemyElems.data[enemy.Attribute];
  }

  @ResolveProperty(type => [Dot], { nullable: true })
  async Dots(@Parent() enemy: Enemy) {
    return this.dots.get((enemy.PatternID >> 8) % 4096, 'Enemy');
  }
}
