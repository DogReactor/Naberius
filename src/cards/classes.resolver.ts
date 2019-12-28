import { ClassDataService } from 'data/class.service';
import {
  Query,
  Args,
  Resolver,
  ResolveProperty,
  Parent,
  Mutation,
} from '@nestjs/graphql';
import { Class } from 'data/models/class.model';
import { Int } from 'type-graphql';
import { Inject } from '@nestjs/common';
import { CacheFileService } from 'data/cacheFile.service';
import { ClassBattleStyleConfig } from 'data/models/classBattleStyleConfig.model';
import { AbilityConfig } from 'data/models/abilityConfig.model';
import { AbilitiesResolver } from './abilities.resolver';
import { Ability } from 'data/models/ability.model';
import { Card } from 'data/models/card.model';
import { DataService } from 'data/data.service';
import { ClassMeta } from 'data/models/classMeta.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Missile } from 'data/models/missile.model';
import { Logger } from 'logger/logger.service';

@Resolver(Class)
export class ClassesResolver {
  constructor(
    private readonly classes: ClassDataService,
    @Inject('ClassBattleStyleConfig')
    private readonly classBattleStyleConfigs: CacheFileService<
      ClassBattleStyleConfig
    >,
    private readonly abilitiesResolver: AbilitiesResolver,
    @Inject('CardList')
    private readonly cards: DataService<Card>,
    @InjectRepository(ClassMeta)
    private readonly classMetaRepo: Repository<ClassMeta>,
    @Inject('Missile')
    private readonly missiles: CacheFileService<Missile>,
    private readonly logger: Logger,
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

  @ResolveProperty(type => [Card])
  Cards(@Parent() classData: Class) {
    return this.cards.data.filter(c => c.InitClassID === classData.ClassID);
  }

  @ResolveProperty(type => [String], { nullable: true })
  async NickNames(@Parent() classData: Class) {
    const meta = await this.classMetaRepo.findOne({
      ClassID: classData.ClassID,
    });
    if (meta) {
      return meta.NickNames;
    }
  }

  @ResolveProperty(type => Missile, { nullable: true })
  Missile(@Parent() classData: Class) {
    if (classData.MissileID !== -1) {
      return this.missiles.data[classData.MissileID];
    }
  }

  /***********
   * Queries *
   ***********/

  @Query(type => [Class])
  Classes(
    @Args({ name: 'MaterialID', type: () => Int, nullable: true })
    MaterialID?: number,
  ) {
    if (MaterialID) {
      return this.classes.data.filter(cl =>
        [
          cl.JobChangeMaterial1,
          cl.JobChangeMaterial2,
          cl.JobChangeMaterial3,
        ].includes(MaterialID),
      );
    }
    return this.classes.data;
  }

  @Query(type => Class, { nullable: true })
  Class(
    @Args({ name: 'ClassID', type: () => Int, nullable: true })
    ClassID?: number,
    @Args({ name: 'Name', type: () => String, nullable: true }) Name?: string,
  ) {
    if (Name) {
      return this.classes.data.find(cl => cl.Name === Name);
    }
    return this.classes.data.find(cl => cl.ClassID === ClassID);
  }

  /*************
   * Mutations *
   *************/

  @Mutation(type => Class, { nullable: true })
  async ClassMeta(
    @Args({ name: 'ClassID', type: () => Int }) ClassID: number,
    @Args({ name: 'NickNames', type: () => [String], nullable: true })
    NickNames: string[],
  ) {
    try {
      const classData = this.classes.data.find(cl => cl.ClassID == ClassID);
      if (!classData) {
        return null;
      }
      let meta = await this.classMetaRepo.findOne({ ClassID });
      if (meta && !NickNames) {
        await this.classMetaRepo.delete({ ClassID });
        return null;
      }
      if (!meta) {
        meta = new ClassMeta();
        meta.ClassID = ClassID;
      }
      if (NickNames instanceof Array) {
        meta.NickNames = NickNames;
      }
      await this.classMetaRepo.save(meta);
      return classData;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }
}
