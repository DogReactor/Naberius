import { Injectable, Inject } from '@nestjs/common';
import { join } from 'path';
import { ensureDirSync, readdir, writeFile } from 'fs-extra';
import { Logger } from 'logger/logger.service';
import { SkinUnitMap } from 'data/models/skinUnitMap.model';
import { SkinUnit } from 'data/models/skin.model';
import { ParsedConfigService } from 'config/config.service';
import { RequestService } from 'common/request.service';
import { Card } from 'data/models/card.model';
import { NameText } from 'data/models/nameText.model';
import { DataFileService } from 'data/dataFile.service';
import { CacheFileService } from './cacheFile.service';

// join and cache skinIndex-cardID relationship
@Injectable()
export class SkinUnitCacheService extends CacheFileService<SkinUnitMap> {
  constructor(
    request: RequestService,
    @Inject('CardList')
    private readonly cards: DataFileService<Card>,
    private readonly config: ParsedConfigService,
    @Inject('NameText')
    private readonly nameTexts: CacheFileService<NameText>,
    private readonly logger: Logger,
  ) {
    super(request);
    this.setFilePath(join(config.get('DB_CACHE_DIR'), 'SkinUnitMap.json'));
  }

  getSkinUnits(rowid: number) {
    const unit = this.data.find(item => item.skinIndex === rowid);
    return unit?.cardIDList;
  }

  async update() {
    this.data = [] as SkinUnitMap[];
    const re = /^skin_\d{4}$/;
    this.cards.data.forEach((card) => {
      if (card.ExtendSkin01 === 'null') {
        return;
      }
      const skinName = [card.ExtendSkin01, card.ExtendSkin02, card.ExtendSkin03, card.ExtendSkin04];
      let cardName = this.nameTexts.data[Number.parseInt(card.CardID, 10) - 1]?.Message;
      if (!cardName) {
        cardName = '???'
      }
      const cardInfo: SkinUnit = {
          cardID: Number.parseInt(card.CardID),
          name: cardName,
          rarity: Number.parseInt(card.Rare),
      };
      let i = 0;
      do {
        if (re.test(skinName[i])) {
          const idx = Number.parseInt(skinName[i].substring(5,9));
          let entry: SkinUnitMap | undefined = this.data.find(item => item.skinIndex === idx);
          if (!entry) {
            entry = {skinIndex: idx, cardIDList: []};
            this.data.push(entry);
          }
          entry.cardIDList.push(cardInfo);
        }
        i++;
      } while ((i < 4) && (skinName[i] !== 'null'));
    });

    await writeFile(this.filePath, JSON.stringify(this.data));
  }

}
