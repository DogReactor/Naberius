import * as _ from 'lodash';
import { getSkillInfluences } from '../resolvers/SkillResolver';
import {
  nameText,
  cardList,
  skillList,
  abilityList,
  classData,
  statusText,
  systemText,
  playerRaceType,
} from '../dataFiles';
import { logger } from '../../logger';

class CardConnector {
  private cards: any[] = [];

  constructor() {
    this.init();
  }

  public init() {
    try {
      this.cards = [];
      for (const card of cardList.data) {
        this.cards.push({
          ...card,
          Name:
            nameText.data[card.CardID - 1] &&
            nameText.data[card.CardID - 1].Message,
          SkillInit: this.getSkills(card.ClassLV0SkillID),
          SkillCC: this.getSkills(card.ClassLV1SkillID),
          SkillEvo: this.getSkills(card.EvoSkillID),
          AbilityInitInfo: {
            ...abilityList.data[card.Ability_Default],
            AbilityID: card.Ability_Default,
          },
          AbilityEvoInfo: {
            ...abilityList.data[card.Ability],
            AbilityID: card.Ability,
          },
          Class: this.getClasses(card),
          IllustID: card.Illust,
          Race: this.getRace(card),
          Talks: statusText.data
            .slice(card.Flavor, card.Flavor + 3)
            .map((c: any) => c.Message),
        });
      }
    } catch (err) {
      logger.error(err.stack);
      logger.error('CardConnector init failed');
    }
  }

  public getCard(arg: number | ((card: any) => boolean)) {
    if (typeof arg === 'number') {
      return this.cards.find(card => card.CardID === arg);
    } else if (typeof arg === 'function') {
      return this.cards.find(arg);
    }
  }

  public getCards(arg?: ((card: any) => boolean)) {
    if (arg) {
      return this.cards.filter(arg);
    }
    return this.cards;
  }

  private getSkills(SkillID: number) {
    const skill = skillList.data[SkillID];
    if (!skill) {
      return [];
    }
    const skills: any[] = [{ ...skill, SkillID }];
    let index = 0;
    while (index < skills.length) {
      const influences = getSkillInfluences(skills[index]);
      influences.forEach((influence: any) => {
        // 49为切换技能
        if (influence.Data_InfluenceType === 49) {
          const targetID = influence.Data_AddValue;
          if (targetID !== 0 && !_.find(skills, { SkillID: targetID })) {
            const targetSkill = skillList.data[targetID];
            if (targetSkill) {
              skills.push({ ...targetSkill, SkillID: targetID });
            }
          }
        }
      });
      index++;
    }
    return skills;
  }

  private getClasses(card: any) {
    const classes: { [k: string]: any } = {
      ClassInit: undefined,
      ClassCC: undefined,
      ClassEvo: undefined,
      ClassEvo2a: undefined,
      ClassEvo2b: undefined,
    };
    classes.ClassInit = _.find(classData.data, {
      ClassID: card.InitClassID,
    });
    // 如果职业存在
    if (classes.ClassInit) {
      // 如果初始职业可以进阶
      if (classes.ClassInit.JobChange) {
        // 根据是否需要珠子判断为cc还是觉醒
        if (classes.ClassInit.Data_ExtraAwakeOrb1) {
          if (card.Rare > 2) {
            classes.ClassEvo = _.find(classData.data, {
              ClassID: classes.ClassInit.JobChange,
            });
          } else {
            // 特殊觉醒职业的银，基础职业最大等级55
            classes.ClassInit.MaxLevelUnit = 55;
          }
        } else {
          classes.ClassCC = _.find(classData.data, {
            ClassID: classes.ClassInit.JobChange,
          });

          if (card.Rare === 2) {
            classes.ClassCC.MaxLevelUnit = 55;
          } else if (card.Rare === 3) {
            classes.ClassCC.MaxLevelUnit = 60;
          } else if (card.Rare === 4) {
            classes.ClassCC.MaxLevelUnit = 70;
          } else if (card.Rare === 5) {
            classes.ClassCC.MaxLevelUnit = 80;
          } else if (card.Rare === 7) {
            classes.ClassCC.MaxLevelUnit = 75;
          }
        }
      }
      // 如果cc职业可以进阶
      if (classes.ClassCC && classes.ClassCC.JobChange && card.Rare > 2) {
        classes.ClassEvo = _.find(classData.data, {
          ClassID: classes.ClassCC.JobChange,
        });
        if (card.Rare === 3) {
          classes.ClassCC.MaxLevelUnit = 80;
        } else if (card.Rare === 4) {
          classes.ClassCC.MaxLevelUnit = 90;
        } else if (card.Rare === 5) {
          classes.ClassCC.MaxLevelUnit = 99;
        } else if (card.Rare === 7) {
          classes.ClassCC.MaxLevelUnit = 85;
        }
      }
      // 如果觉醒职业可以二觉
      if (classes.ClassEvo && classes.ClassEvo.AwakeType1) {
        classes.ClassEvo2a = _.find(classData.data, {
          ClassID: classes.ClassEvo.AwakeType1,
        });
        classes.ClassEvo2b = _.find(classData.data, {
          ClassID: classes.ClassEvo.AwakeType2,
        });
      }
    }
    return classes;
  }

  private getRace = (card: any) => {
    const raceType = _.find(playerRaceType.data, {
      _TypeID: card._TypeRace,
    }) as any;
    if (raceType) {
      if (raceType._SystemTextID === 0) {
        return 'なし';
      }
      const text = systemText.data[raceType._SystemTextID];
      return text ? text.Data_Text : null;
    }
  };
}

export default new CardConnector();
