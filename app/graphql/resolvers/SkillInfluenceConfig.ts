import { getSkillInfluenceMeta } from '../connector/SkillInfluenceMetaConnector';
export default {
  Description: async (influence: any) => {
    const influenceMeta = await getSkillInfluenceMeta(
      influence.Data_InfluenceType,
    );
    if (influenceMeta) {
      return influenceMeta.Description;
    }
    return null;
  },
};
