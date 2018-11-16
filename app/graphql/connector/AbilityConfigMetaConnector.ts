import { AbilityConfigMeta, AbilityConfigMetaModel } from '../../models';

export async function updateAbilityConfigMeta(doc: AbilityConfigMeta) {
  let abilityConfigMeta = await AbilityConfigMetaModel.findOne({
    ID: doc.ID,
  });
  if (!abilityConfigMeta) {
    if (!doc.Description) {
      return true;
    }
    abilityConfigMeta = new AbilityConfigMetaModel(doc);
  } else {
    if (!doc.Description) {
      await abilityConfigMeta.remove();
      return true;
    }
    abilityConfigMeta.Description = doc.Description;
  }
  await abilityConfigMeta.save();
  return true;
}

export async function getAbilityConfigMeta(ID: number) {
  return AbilityConfigMetaModel.findOne({
    ID,
  });
}

export async function getAllAbilityConfigMeta() {
  return AbilityConfigMetaModel.find();
}
