import { ClassMetaModel, ClassMeta } from '../../models';

export async function updateClassMeta(doc: ClassMeta) {
  let classMeta = await ClassMetaModel.findOne({ ClassID: doc.ClassID });
  if (!classMeta) {
    classMeta = new ClassMetaModel(doc);
  } else {
    classMeta.NickName = doc.NickName;
  }
  await classMeta.save();
  return classMeta;
}

export async function getClassMeta(classID: number) {
  return ClassMetaModel.findOne({ ClassID: classID });
}
