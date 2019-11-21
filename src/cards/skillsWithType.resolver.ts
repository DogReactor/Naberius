import { Resolver, ResolveProperty, Parent } from '@nestjs/graphql';
import { SkillsWithType } from './models/skillsWithType.model';
import { Inject } from '@nestjs/common';
import { CacheFileService } from 'data/cacheFile.service';
import { Skill } from 'data/models/skill.model';
import { SkillInfluenceConfig } from 'data/models/skillInfluenceConfig.model';
import { SkillsResolver } from './skills.resolver';

@Resolver(SkillsWithType)
export class SkillsWithTypeResolver {
  constructor(
    @Inject('SkillList')
    private readonly skills: CacheFileService<Skill>,
    private readonly skillsResolver: SkillsResolver,
  ) {}

  @ResolveProperty(type => [Skill])
  Skills(@Parent() skillsWithType: SkillsWithType) {
    const initSkill = this.skills.data[skillsWithType.initSkillID];
    if (!initSkill) {
      return [];
    }
    const skills = [initSkill];
    const skillIDs = [skillsWithType.initSkillID];
    let index = 0;
    while (index < skills.length) {
      const influences = this.skillsResolver.Influences(skills[index]);
      (skills[index].Influences = influences).forEach(influence => {
        // 49为切换技能
        if (influence.Data_InfluenceType === 49) {
          const targetID = influence.Data_AddValue;
          if (targetID !== 0 && !skillIDs.includes(targetID)) {
            const targetSkill = this.skills.data[targetID];
            if (targetSkill) {
              skills.push(targetSkill);
              skillIDs.push(targetID);
            }
          }
        }
      });
      index++;
    }
    return skills;
  }
}
