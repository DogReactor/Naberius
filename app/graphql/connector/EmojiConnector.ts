import { Emoji, EmojiModel } from '../../models';
import * as mongoose from 'mongoose';

export async function getEmojis() {
  return EmojiModel.find();
}

export async function updateEmoji(emoji: Emoji) {
  if (emoji._id) {
    const target = await EmojiModel.findById(emoji._id);
    if (target) {
      if (emoji.name) {
        target.name = emoji.name;
      }
      if (emoji.emoji) {
        target.emoji = emoji.emoji;
      }
      if (emoji.group) {
        target.group = emoji.group;
      }
      await target.save();
      return true;
    }
  }
  return false;
}

export async function removeEmoji(ID: string) {
  if (await EmojiModel.findByIdAndDelete(mongoose.Types.ObjectId(ID))) {
    return true;
  }
  return false;
}

export async function removeEmojiItem(ID: string, index: number) {
  const emoji = await EmojiModel.findById(mongoose.Types.ObjectId(ID));
  if (emoji) {
    if (emoji.emoji.length <= 1) { return false; }
    emoji.emoji.splice(index, 1);
    await emoji.save();
    return true;
  }
  return false;
}
