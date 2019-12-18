import { ClassDataService } from 'data/class.service';
import {
  Query,
  Args,
  Resolver,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { Class } from 'data/models/class.model';
import { Int } from 'type-graphql';
import { Inject } from '@nestjs/common';
import { CacheFileService } from 'data/cacheFile.service';
import { ClassBattleStyleConfig } from 'data/models/classBattleStyleConfig.model';
import { AbilityConfig } from 'data/models/abilityConfig.model';
import { AbilitiesResolver } from './abilities.resolver';
import { Ability } from 'data/models/ability.model';

@Resolver(Class)
export class ClassesResolver {
  constructor(
    private readonly classes: ClassDataService,
    @Inject('ClassBattleStyleConfig')
    private readonly classBattleStyleConfigs: CacheFileService<
      ClassBattleStyleConfig
    >,
    private readonly abilitiesResolver: AbilitiesResolver,
  ) {}

  /**************
   * Properties *
   **************/

  @ResolveProperty(type => [Class])
  JobChangeMaterials(@Parent() classData: Class) {
    return [
      classData.JobChangeMaterial1,
      classData.JobChangeMaterial2,
      classData.JobChangeMaterial3,
    ]
      .filter(id => id)
      .map(id => this.classes.data.find(cl => cl.ClassID === id));
  }

  @ResolveProperty(type => [Class])
  Data_ExtraAwakeOrbs(@Parent() classData: Class) {
    return [classData.Data_ExtraAwakeOrb1, classData.Data_ExtraAwakeOrb2]
      .filter(id => id)
      .map(id => this.classes.data.find(cl => cl.ClassID === id));
  }

  @ResolveProperty(type => ClassBattleStyleConfig, { nullable: true })
  BattleStyle(@Parent() classData: Class) {
    return this.classBattleStyleConfigs.data.find(
      config => config.Data_ID === classData.ClassID,
    );
  }

  @ResolveProperty(type => [AbilityConfig], { nullable: true })
  ClassAbilityConfigs(@Parent() classData: Class) {
    return this.abilitiesResolver.Configs(({
      _ConfigID: classData.ClassAbility1,
    } as any) as Ability);
  }

  /***********
   * Queries *
   ***********/

  @Query(type => [Class])
  Classes() {
    return this.classes.data;
  }

  @Query(type => Class, { nullable: true })
  Class(@Args({ name: 'ClassID', type: () => Int }) ClassID: number) {
    return this.classes.data.find(cl => cl.ClassID === ClassID);
  }
}
