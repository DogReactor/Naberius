import { Resolver, Mutation } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { CacheFileService } from './cacheFile.service';
import { HarlemTextService } from './harlemText.service';

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
    private readonly harlemTexts: HarlemTextService,
  ) {}
  @Mutation(returns => Boolean)
  updateFiles() {
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
    ].forEach(service => service.update());
    return true;
  }
}
