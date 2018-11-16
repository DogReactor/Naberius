import { getAbilityConfigMeta } from '../connector/AbilityConfigMetaConnector';
export default {
  Description: async (config: any) => {
    const configMeta = await getAbilityConfigMeta(config._InfluenceType);
    if (configMeta) {
      return configMeta.Description;
    }
    return null;
  },
};
