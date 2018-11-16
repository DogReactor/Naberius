import * as mongoose from 'mongoose';
import { prop, Typegoose, arrayProp } from 'typegoose';
import { MONGODB_URL } from './consts';

mongoose.connect(
  MONGODB_URL,
  { useNewUrlParser: true },
);

export class CardMeta extends Typegoose {
  @prop({ required: true })
  public CardID: number;

  @prop()
  public NickName?: string;

  @prop()
  public ConneName?: string;
}

export const CardMetaModel = new CardMeta().getModelForClass(CardMeta, {
  schemaOptions: {
    collection: 'cardMeta',
  },
});

export class ClassMeta extends Typegoose {
  @prop({ required: true })
  public ClassID: number;

  @prop()
  public NickName?: string;

  @prop()
  public CnName?: string;
}

export const ClassMetaModel = new ClassMeta().getModelForClass(ClassMeta, {
  schemaOptions: {
    collection: 'classMeta',
  },
});

export class SkillInfluenceMeta extends Typegoose {
  @prop({ required: true })
  public ID: number;

  @prop({ required: true })
  public Description?: string;
}

export const SkillInfluenceMetaModel = new SkillInfluenceMeta().getModelForClass(
  SkillInfluenceMeta,
  {
    schemaOptions: {
      collection: 'skillMeta',
    },
  },
);

export class AbilityConfigMeta extends Typegoose {
  @prop({ required: true })
  public ID: number;

  @prop({ required: true })
  public Description?: string;
}

export const AbilityConfigMetaModel = new AbilityConfigMeta().getModelForClass(
  AbilityConfigMeta,
  {
    schemaOptions: {
      collection: 'abilityMeta',
    },
  },
);

export class Emoji extends Typegoose {
  @arrayProp({ required: true, items: String })
  public name: string[];

  @arrayProp({ required: true, items: String })
  public emoji: string[];

  @arrayProp({ required: true, items: Number })
  public group: number[];

  @prop()
  public _id: mongoose.Types.ObjectId;
}

export const EmojiModel = new Emoji().getModelForClass(Emoji, {
  schemaOptions: {
    collection: 'emoji',
  },
});
