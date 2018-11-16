import { getClassMeta } from '../connector/ClassMetaConnector';

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
  CnName: async (unitClass: any) => {
    const classMeta = await getClassMeta(unitClass.ClassID);
    if (classMeta) {
      return classMeta.CnName;
    }
    return null;
  },
};
