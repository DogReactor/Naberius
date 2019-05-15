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
  playerAssignType,
  playerIdentityType,
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
          Illust: statusText.data[card.Illust].Message,
          Race: this.getType(card, '_TypeRace', playerRaceType),
          Assign: this.getType(card, 'Assign', playerAssignType),
          Identity: this.getType(card, 'Identity', playerIdentityType),
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
    classes.ClassInit = _.cloneDeep(
      _.find(classData.data, {
        ClassID: card.InitClassID,
      }),
    );
    // 如果职业存在
    if (classes.ClassInit) {
      // 如果单位是铁铜，设置初始等级上限
      if (card.Rare === 0) {
        classes.ClassInit.MaxLevelUnit = 30;
      } else if (card.Rare === 1) {
        classes.ClassInit.MaxLevelUnit = 40;
      }
      // 如果初始职业可以进阶
      if (classes.ClassInit.JobChange) {
        // 根据是否需要珠子判断为cc还是觉醒
        if (classes.ClassInit.Data_ExtraAwakeOrb1) {
          // 初始职业直接觉醒的情况
          if (card.Rare > 2) {
            // 若是银以上的特殊觉醒职业，设置觉醒职业
            classes.ClassEvo = _.cloneDeep(
              _.find(classData.data, {
                ClassID: classes.ClassInit.JobChange,
              }),
            );

            // 给银以上的职业的特殊觉醒设置等级上限
            switch (card.Rare) {
              case 3:
                classes.ClassEvo.MaxLevelUnit = 80;
                break;
              case 4:
                classes.ClassEvo.MaxLevelUnit = 90;
                break;
              case 5:
                classes.ClassEvo.MaxLevelUnit = 99;
                break;
              case 7:
                classes.ClassEvo.MaxLevelUnit = 85;
                break;
              default:
                classes.ClassEvo.MaxLevelUnit = 10;
            }
          } else {
            // 特殊觉醒职业的银，基础职业最大等级55
            classes.ClassInit.MaxLevelUnit = 55;
          }
        } else {
          // 初始职业cc的情况，设置cc职业
          classes.ClassCC = _.cloneDeep(
            _.find(classData.data, {
              ClassID: classes.ClassInit.JobChange,
            }),
          );
        }
      }

      // 如果cc职业可以进阶，设置觉醒职业
      if (classes.ClassCC && classes.ClassCC.JobChange && card.Rare > 2) {
        classes.ClassEvo = _.cloneDeep(
          _.find(classData.data, {
            ClassID: classes.ClassCC.JobChange,
          }),
        );
      }

      // 如果有觉醒职业，设置等级
      if (classes.ClassEvo) {
        switch (card.Rare) {
          case 3:
            classes.ClassEvo.MaxLevelUnit = 80;
            break;
          case 4:
            classes.ClassEvo.MaxLevelUnit = 90;
            break;
          case 5:
            classes.ClassEvo.MaxLevelUnit = 99;
            break;
          case 7:
            classes.ClassEvo.MaxLevelUnit = 85;
            break;
          default:
            classes.ClassEvo.MaxLevelUnit = 10;
        }
      }

      // 如果觉醒职业可以二觉
      if (classes.ClassEvo && classes.ClassEvo.AwakeType1) {
        classes.ClassEvo2a = _.cloneDeep(
          _.find(classData.data, {
            ClassID: classes.ClassEvo.AwakeType1,
          }),
        );
        classes.ClassEvo2b = _.cloneDeep(
          _.find(classData.data, {
            ClassID: classes.ClassEvo.AwakeType2,
          }),
        );
      }
    }
    return classes;
  }

  private getType = (card: any, prop: string, table: any) => {
    const type = _.find(table.data, {
      _TypeID: card[prop],
    }) as any;
    if (type) {
      if (type._SystemTextID === 0) {
        return null;
      }
      const text = systemText.data[type._SystemTextID];
      return text ? text.Data_Text : null;
    }
  };

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

  private getAssign = (card: any) => {
    const assignType = (playerAssignType.data as Array<{
      _TypeID: number;
      _SystemTextID: number;
    }>).find(assign => assign._TypeID === card.Assign);
    if (assignType) {
      if (assignType._SystemTextID === 0) {
        return null;
      }
      const text = systemText.data[assignType._SystemTextID];
      return text ? text.Data_Text : null;
    }
  };
}

export default new CardConnector();
