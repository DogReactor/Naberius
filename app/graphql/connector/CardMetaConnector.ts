import { CardMetaModel, CardMeta } from '../../models';

export async function updateCardMeta(doc: CardMeta) {
  let cardMeta = await CardMetaModel.findOne({ CardID: doc.CardID });
  if (!cardMeta) {
    cardMeta = new CardMetaModel(doc);
  } else {
    cardMeta.NickName = doc.NickName;
    cardMeta.ConneName = doc.ConneName;
  }
  await cardMeta.save();
  return cardMeta;
}

export async function getCardMeta(cardID: number) {
  return CardMetaModel.findOne({ CardID: cardID });
}
