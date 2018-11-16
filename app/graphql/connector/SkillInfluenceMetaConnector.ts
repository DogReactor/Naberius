import { SkillInfluenceMeta, SkillInfluenceMetaModel } from '../../models';

export async function updateSkillInfluenceMeta(doc: SkillInfluenceMeta) {
  let skillInfluenceMeta = await SkillInfluenceMetaModel.findOne({
    ID: doc.ID,
  });
  if (!skillInfluenceMeta) {
    if (!doc.Description) {
      return true;
    }
    skillInfluenceMeta = new SkillInfluenceMetaModel(doc);
  } else {
    if (!doc.Description) {
      await skillInfluenceMeta.remove();
      return true;
    }
    skillInfluenceMeta.Description = doc.Description;
  }
  await skillInfluenceMeta.save();
  return true;
}

export async function getSkillInfluenceMeta(ID: number) {
  return SkillInfluenceMetaModel.findOne({
    ID,
  });
}

export async function getAllSkillInfluenceMeta() {
  return SkillInfluenceMetaModel.find();
}
