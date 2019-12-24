import { Resolver, ResolveProperty, Parent } from '@nestjs/graphql';
import { Enemy } from 'data/models/enemy.model';
import { Inject } from '@nestjs/common';
import { CacheFileService } from 'data/cacheFile.service';
import { EnemyType } from 'data/models/enemyType.model';
import { EnemyElem } from 'data/models/enemyElem.model';
import { DotService } from 'data/dot.service';
import { Dot } from 'data/models/dot.model';
import { EnemySpecialtyConfig } from 'data/models/enemySpecialtyConfig.model';
import { Missile } from 'data/models/missile.model';

@Resolver(Enemy)
export class EnemiesResolver {
  constructor(
    @Inject('EnemyType')
    private readonly enemyTypes: CacheFileService<EnemyType>,
    @Inject('EnemyElem')
    private readonly enemyElems: CacheFileService<EnemyElem>,
    private readonly dots: DotService,
    @Inject('EnemySpecialty_Config')
    private readonly enemySpecialties: CacheFileService<EnemySpecialtyConfig>,
    @Inject('Missile')
    private readonly missiles: CacheFileService<Missile>,
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

  @ResolveProperty(type => [EnemySpecialtyConfig])
  SpecialtyConfigs(@Parent() enemy: Enemy) {
    if (enemy.SpecialEffect === 0) {
      return [];
    }
    let index = this.enemySpecialties.data.findIndex(
      es => es.ID_Config === enemy.SpecialEffect,
    );
    const configs: EnemySpecialtyConfig[] = [];
    if (index !== -1) {
      let config: EnemySpecialtyConfig;
      while (true) {
        config = this.enemySpecialties.data[index++];
        if (
          !(
            config &&
            (config.ID_Config === 0 || config.ID_Config === enemy.SpecialEffect)
          )
        ) {
          break;
        }
        configs.push(config);
      }
    }
    return configs;
  }

  @ResolveProperty(type => Missile, { nullable: true })
  Missile(@Parent() enemy: Enemy) {
    if (enemy.MissileID !== -1) {
      return this.missiles.data[enemy.MissileID];
    }
  }
}
