import * as _ from 'lodash';
import * as dbs from '../dataFiles';

export function getSkillInfluences(skill: any) {
  const type = _.find(dbs.skillTypeList.data, {
    SkillTypeID: skill.SkillType,
  }) as any;
  if (type && type.ID_Influence !== 0) {
    let index = _.findIndex(dbs.skillInfluenceConfig.data, {
      Data_ID: type.ID_Influence,
    });
    if (index) {
      const configs: any[] = [];
      let config = dbs.skillInfluenceConfig.data[index];
      while (config.Data_ID === 0 || config.Data_ID === type.ID_Influence) {
        config.Explnation = 10;
        configs.push(config);
        index++;
        config = dbs.skillInfluenceConfig.data[index];
        if (!config) {
          break;
        }
      }
      return configs;
    }
  }
  return [];
}

import CardConnector from '../connector/CardConnector';

export default {
  Text: (skill: any) => {
    const text = dbs.skillText.data[skill.ID_Text];
    return text ? text.Data_Text : null;
  },
  InfluenceConfig: getSkillInfluences,
  CardHave: (skill: any) => {
    if (skill.SkillID === 0) { return []; }
    const cards = CardConnector.getCards(card => {
      if (
        card.SkillInit.find(
          (skillInit: any) => skillInit.SkillID === skill.SkillID,
        ) ||
        card.SkillCC.find(
          (skillCC: any) => skillCC.SkillID === skill.SkillID,
        ) ||
        card.SkillEvo.find(
          (skillEvo: any) => skillEvo.SkillID === skill.SkillID,
        )
      ) {
        return true;
      }
      return false;
    });
    return cards;
  },
};
