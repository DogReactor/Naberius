import { Resolver, Mutation } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { CacheFileService } from './cacheFile.service';

@Resolver()
export class DataResolver {
  constructor(
    @Inject('NameText') private readonly nameTexts: CacheFileService<any>,
    @Inject('StatusText')
    private readonly statusTexts: CacheFileService<any>,
    @Inject('PlayerRaceType')
    private readonly PlayerRaceTypes: CacheFileService<any>,
    @Inject('PlayerAssignType')
    private readonly PlayerAssignTypes: CacheFileService<any>,
    @Inject('PlayerIdentityType')
    private readonly PlayerIdentityTypes: CacheFileService<any>,
    @Inject('SystemText')
    private readonly SystemTexts: CacheFileService<any>,
    @Inject('SkillList')
    private readonly Skills: CacheFileService<any>,
    @Inject('SkillText')
    private readonly SkillTexts: CacheFileService<any>,
    @Inject('SkillTypeList')
    private readonly SkillTypes: CacheFileService<any>,
    @Inject('SkillInfluenceConfig')
    private readonly SkillInfluenceConfigs: CacheFileService<any>,
  ) {}
  @Mutation(returns => Boolean)
  updateFiles() {
    [
      this.nameTexts,
      this.statusTexts,
      this.PlayerRaceTypes,
      this.PlayerAssignTypes,
      this.PlayerIdentityTypes,
      this.SystemTexts,
      this.Skills,
      this.SkillTexts,
      this.SkillTypes,
      this.SkillInfluenceConfigs,
    ].forEach(service => service.update());
    return true;
  }
}
