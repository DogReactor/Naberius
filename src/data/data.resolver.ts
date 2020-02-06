import { Resolver, Mutation } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { CacheFileService } from './cacheFile.service';
import { HarlemTextService } from './harlemText.service';
import { ClassDataService } from './class.service';
import { MissionConfigService } from './missionConfig.service';
import { EventArcService } from './eventArc.service';
import { IcoService } from './ico.service';
import { BannerService } from './banner.service';

@Resolver()
export class DataResolver {
  constructor(
    @Inject('NameText') private readonly nameTexts: CacheFileService<any>,
    @Inject('StatusText')
    private readonly statusTexts: CacheFileService<any>,
    @Inject('PlayerRaceType')
    private readonly playerRaceTypes: CacheFileService<any>,
    @Inject('PlayerAssignType')
    private readonly playerAssignTypes: CacheFileService<any>,
    @Inject('PlayerIdentityType')
    private readonly playerIdentityTypes: CacheFileService<any>,
    @Inject('SystemText')
    private readonly systemTexts: CacheFileService<any>,
    @Inject('SkillList')
    private readonly skills: CacheFileService<any>,
    @Inject('SkillText')
    private readonly skillTexts: CacheFileService<any>,
    @Inject('SkillTypeList')
    private readonly skillTypes: CacheFileService<any>,
    @Inject('SkillInfluenceConfig')
    private readonly skillInfluenceConfigs: CacheFileService<any>,
    @Inject('ClassBattleStyleConfig')
    private readonly classBattleStyleConfigs: CacheFileService<any>,
    private readonly harlemTexts: HarlemTextService,
    private readonly classData: ClassDataService,
    @Inject('AbilityList')
    private readonly abilities: CacheFileService<any>,
    @Inject('AbilityText')
    private readonly abilityTexts: CacheFileService<any>,
    @Inject('AbilityConfig')
    private readonly abilityConfigs: CacheFileService<any>,
    private readonly missionConfigs: MissionConfigService,
    private readonly eventArcs: EventArcService,
    private readonly icos: IcoService,
    @Inject('QuestEventText')
    private readonly questEventTexts: CacheFileService<any>,
    @Inject('EnemyType')
    private readonly enemyTypes: CacheFileService<any>,
    @Inject('EnemyElem')
    private readonly enemyElems: CacheFileService<any>,
    @Inject('QuestTermConfig')
    private readonly questTermConfigs: CacheFileService<any>,
    @Inject('EnemySpecialty_Config')
    private readonly enemySpecialties: CacheFileService<any>,
    private readonly temples: BannerService,
    @Inject('Missile')
    private readonly missiles: CacheFileService<any>,
    @Inject('MessageText')
    private readonly generalMessageTexts: CacheFileService<any>,
    @Inject('UnitSpecialty')
    private readonly unitSpecialties: CacheFileService<any>,
  ) {}
  @Mutation(returns => Boolean)
  UpdateFiles() {
    [
      this.nameTexts,
      this.statusTexts,
      this.playerRaceTypes,
      this.playerAssignTypes,
      this.playerIdentityTypes,
      this.systemTexts,
      this.skills,
      this.skillTexts,
      this.skillTypes,
      this.skillInfluenceConfigs,
      this.harlemTexts,
      this.classBattleStyleConfigs,
      this.classData,
      this.abilities,
      this.abilityTexts,
      this.abilityConfigs,
      this.missionConfigs,
      this.icos,
      this.eventArcs,
      this.questEventTexts,
      this.enemyTypes,
      this.enemyElems,
      this.questTermConfigs,
      this.enemySpecialties,
      this.temples,
      this.missiles,
      this.generalMessageTexts,
      this.unitSpecialties,
    ].forEach(service => service.update());
    return true;
  }
}
