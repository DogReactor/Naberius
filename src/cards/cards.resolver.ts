import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { CardSchema } from './schemas/card.schema';
import { Inject } from '@nestjs/common';
import { DataFileService } from 'data/dataFile.service';
import { Card } from 'data/models/card.model';
import { Int } from 'type-graphql';
import { CacheFileService } from 'data/cacheFile.service';
import { NameText } from 'data/models/nameText.model';
import { File } from 'data/models/file.model';
import { StatusText } from 'data/models/statusText.model';
import { SystemText } from 'data/models/systemText.model';

function fileSorter(a: File, b: File) {
  if (a.Name < b.Name) {
    return -1;
  } else if (a.Name === b.Name) {
    return 0;
  }
  return 1;
}

@Resolver(CardSchema)
export class CardsResolver {
  constructor(
    @Inject('CardList') private readonly cardList: DataFileService<Card>,
    @Inject('FileList') private readonly fileList: DataFileService<File>,
    @Inject('NameText')
    private readonly nameTextList: CacheFileService<NameText>,
    @Inject('StatusText')
    private readonly statusTextList: CacheFileService<StatusText>,
    @Inject('SystemText')
    private readonly SystemTextList: CacheFileService<SystemText>,
    @Inject('PlayerRaceType')
    private readonly playerRaceTypeList: CacheFileService<PlayerType>,
    @Inject('PlayerAssignType')
    private readonly playerAssignTypeList: CacheFileService<PlayerType>,
    @Inject('PlayerIdentityType')
    private readonly playerIdentityTypeList: CacheFileService<PlayerType>,
  ) {}

  getType(
    card: Card,
    file:
      | 'playerRaceTypeList'
      | 'playerAssignTypeList'
      | 'playerIdentityTypeList',
  ) {
    const type = this[file].data.find(t => t._TypeID === card._TypeRace);
    if (type) {
      const text = this.SystemTextList.data[type._SystemTextID];
      if (text) {
        return text.Data_Text;
      }
    }
    return null;
  }

  /**************
   * Properties *
   **************/

  @ResolveProperty()
  Name(@Parent() card: Card) {
    const name = this.nameTextList.data[card.CardID - 1];
    if (name) {
      return name.Message;
    } else {
      return null;
    }
  }

  @ResolveProperty()
  ImageStand(@Parent() card: Card) {
    // TODO: extreamly slow
    return this.fileList._.filter(
      file =>
        !!RegExp(
          `^${(Array(3).join('0') + card.CardID).slice(-3)}_card_\\d\\.png$`,
        ).exec(file.Name),
    )
      .sort(fileSorter)
      .map(file => file.Link)
      .value();
  }

  @ResolveProperty()
  ImageCG(@Parent() card: Card) {
    // TODO: extreamly slow
    return this.fileList._.filter(file => {
      return !!RegExp(
        `^HarlemCG_${(Array(3).join('0') + card.CardID).slice(-3)}_\\d\\.png$`,
      ).exec(file.Name);
    })
      .slice()
      .sort(fileSorter)
      .map(file => file.Link)
      .value();
  }

  @ResolveProperty()
  IllustName(@Parent() card: Card) {
    return this.statusTextList.data[card.Illust];
  }

  @ResolveProperty()
  RaceName(@Parent() card: Card) {
    return this.getType(card, 'playerRaceTypeList');
  }

  @ResolveProperty()
  AssignName(@Parent() card: Card) {
    return this.getType(card, 'playerAssignTypeList');
  }

  @ResolveProperty()
  IdentityName(@Parent() card: Card) {
    return this.getType(card, 'playerIdentityTypeList');
  }

  /***********
   * Queries *
   ***********/

  @Query(type => [CardSchema])
  cards() {
    return this.cardList.data;
  }

  @Query(type => CardSchema, { nullable: true })
  card(@Args({ name: 'CardID', type: () => Int }) CardID: number) {
    return this.cardList.data.find(card => card.CardID === CardID);
  }
}
