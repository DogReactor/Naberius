import { getClassMeta } from '../connector/ClassMetaConnector';
import * as dbs from '../dataFiles';

export default {
  MaxLevelUnit: (unitClass: any) => {
    if (unitClass.MaxLevelUnit) {
      return unitClass.MaxLevelUnit;
    }
    return unitClass.MaxLevel;
  },
  NickName: async (unitClass: any) => {
    const classMeta = await getClassMeta(unitClass.ClassID);
    if (classMeta) {
      return classMeta.NickName;
    }
    return null;
  },
  JobChangeMaterial: (unitClass: any) => {
    const classIDs = [
      unitClass.JobChangeMaterial1,
      unitClass.JobChangeMaterial2,
      unitClass.JobChangeMaterial3,
    ].filter(id => id);
    return classIDs.map(id =>
      dbs.classData.data.find((classData: any) => classData.ClassID === id),
    );
  },
  Data_ExtraAwakeOrb: (unitClass: any) => {
    const classIDs = [
      unitClass.Data_ExtraAwakeOrb1,
      unitClass.Data_ExtraAwakeOrb2,
    ].filter(id => id);
    return classIDs.map(id =>
      dbs.classData.data.find((classData: any) => classData.ClassID === id),
    );
  },
};
