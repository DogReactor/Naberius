import {
  Resolver,
  ResolveProperty,
  Parent,
  Query,
  Args,
} from '@nestjs/graphql';
import { Skill } from 'data/models/skill.model';
import { Inject } from '@nestjs/common';
import { CacheFileService } from 'data/cacheFile.service';
import { SkillText } from 'data/models/skillText.model';
import { SkillType } from 'data/models/skillType.model';
import { SkillInfluenceConfig } from 'data/models/skillInfluenceConfig.model';
import { Int } from 'type-graphql';
import { Card } from 'data/models/card.model';
import { DataService } from 'data/data.service';

@Resolver(Skill)
export class SkillsResolver {
  constructor(
    @Inject('SkillList')
    private readonly skills: CacheFileService<Skill>,
    @Inject('SkillText')
    private readonly skillTexts: CacheFileService<SkillText>,
    @Inject('SkillTypeList')
    private readonly skillTypes: CacheFileService<SkillType>,
    @Inject('SkillInfluenceConfig')
    private readonly skillInfluenceConfigs: CacheFileService<
      SkillInfluenceConfig
    >,
    @Inject('CardList')
    private readonly cards: DataService<Card>,
  ) {}

  /**************
   * Properties *
   **************/

  @ResolveProperty(type => String)
  Text(@Parent() skill: Skill) {
    return this.skillTexts.data[skill.ID_Text]?.Data_Text;
  }

  @ResolveProperty(type => [SkillInfluenceConfig])
  Configs(@Parent() skill: Skill): SkillInfluenceConfig[] {
    // avoid calculate again
    if (skill.Configs) {
      return skill.Configs;
    }
    const type = this.skillTypes.data.find(
      t => t.SkillTypeID === skill.SkillType,
    );
    if (type && type.ID_Influence !== 0) {
      // find influence index
      let index = this.skillInfluenceConfigs.data.findIndex(
        config => config.Data_ID === type.ID_Influence,
      );
      if (index) {
        const configs: SkillInfluenceConfig[] = [];
        let config = this.skillInfluenceConfigs.data[index];
        // push config to result if config.Data_ID === 0
        while (config.Data_ID === 0 || config.Data_ID === type.ID_Influence) {
          configs.push(config);
          index++;
          config = this.skillInfluenceConfigs.data[index];
          if (!config) {
            break;
          }
        }
        return configs;
      }
    }
    return [];
  }

  @ResolveProperty(type => Int)
  SkillID(@Parent() skill: Skill) {
    return skill.index;
  }

  @ResolveProperty(type => [Card])
  Cards(@Parent() skill: Skill) {
    return this.cards.data.filter(
      card =>
        card.ClassLV0SkillID === skill.index ||
        card.ClassLV1SkillID === skill.index ||
        card.EvoSkillID === skill.index,
    );
  }

  /***********
   * Queries *
   ***********/

  @Query(type => [Skill])
  Skills() {
    return this.skills.data;
  }

  @Query(type => Skill, { nullable: true })
  Skill(@Args({ name: 'SkillID', type: () => Int }) SkillID: number) {
    return this.skills.data[SkillID];
  }

  @Query(type => String)
  SkillText(
    @Args({ name: 'SkillTextID', type: () => Int }) SkillTextID: number,
  ) {
    return this.skillTexts.data[SkillTextID]?.Data_Text;
  }
}
