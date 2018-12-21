import * as _ from 'lodash';
import * as dbs from '../dataFiles';
import { getEnemyDotLength } from '../connector/EnemyConnector';

export default {
  Types: (enemy: any) => {
    const types: any[] = [];
    const type = dbs.enemyType.data[enemy.Type];
    if (enemy.Type !== 0 && type) {
      types.push(type._EnemyTypeName);
    }

    const attribute = dbs.enemyElem.data[enemy.Attribute];
    if (enemy.Attribute !== 0 && attribute) {
      types.push(attribute._EnemyElementName);
    }

    if (enemy.SkyFlag) {
      types.push('飛行');
    }

    if (enemy._Attribute) {
      types.push(enemy._Attribute);
    }

    return types;
  },
  DotLength: (enemy: any) => getEnemyDotLength(enemy),
};
