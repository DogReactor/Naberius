import * as _ from 'lodash';
import * as dbs from '../dataFiles';
import { numberPadding } from '../utils';
import { BASE_URL } from '../../consts';

export default {
  Image: (map: any) => {
    const mapImgFile = _.find(dbs.fileList.data, {
      Name: `Map${numberPadding(map.MapID, 4)}.png`,
    }) as any;
    if (mapImgFile) {
      return BASE_URL + mapImgFile.Link;
    }
    return null;
  },
};
