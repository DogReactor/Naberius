import * as _ from 'lodash';
import * as dbs from '../dataFiles';
import CardConnector from '../connector/CardConnector';

export default {
  Text: (ability: any) => {
    const text = dbs.abilityText.data[ability.AbilityTextID];
    return text ? text.AbilityText : null;
  },
  Config: (ability: any) => {
    if (ability._ConfigID === 0) {
      return [];
    }
    let index = _.findIndex(dbs.abilityConfig.data, {
      _ConfigID: ability._ConfigID,
    });
    if (index) {
      const configs: any[] = [];
      let config = dbs.abilityConfig.data[index];
      while (config._ConfigID === 0 || config._ConfigID === ability._ConfigID) {
        configs.push(config);
        index++;
        if (index >= dbs.abilityConfig.data.length) {
          break;
        }
        config = dbs.abilityConfig.data[index];
      }
      return configs;
    }
    return [];
  },
  CardHave: (ability: any) => {
    if (ability.AbilityID === 0) { return []; }
    const cards = CardConnector.getCards(card => {
      if (
        [card.AbilityInitInfo, card.AbilityEvoInfo].find(
          (cardAbility: any) => cardAbility.AbilityID === ability.AbilityID,
        )
      ) {
        return true;
      }
      return false;
    });
    return cards;
  },
};
