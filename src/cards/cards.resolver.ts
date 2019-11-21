import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { DataFileService } from 'data/dataFile.service';
import { Card } from 'data/models/card.model';
import { Int } from 'type-graphql';
import { CacheFileService } from 'data/cacheFile.service';
import { NameText } from 'data/models/nameText.model';
import { File } from 'data/models/file.model';
import { StatusText } from 'data/models/statusText.model';
import { SystemText } from 'data/models/systemText.model';
import { SkillsWithType } from './models/skillsWithType.model';

function fileSorter(a: File, b: File) {
  if (a.Name < b.Name) {
    return -1;
  } else if (a.Name === b.Name) {
    return 0;
  }
  return 1;
}

@Resolver(Card)
export class CardsResolver {
  constructor(
    @Inject('CardList') private readonly cards: DataFileService<Card>,
    @Inject('FileList') private readonly files: DataFileService<File>,
    @Inject('NameText')
    private readonly nameTexts: CacheFileService<NameText>,
    @Inject('StatusText')
    private readonly statusTexts: CacheFileService<StatusText>,
    @Inject('SystemText')
    private readonly SystemTexts: CacheFileService<SystemText>,
    @Inject('PlayerRaceType')
    private readonly playerRaceTypes: CacheFileService<PlayerType>,
    @Inject('PlayerAssignType')
    private readonly playerAssignTypes: CacheFileService<PlayerType>,
    @Inject('PlayerIdentityType')
    private readonly playerIdentityTypes: CacheFileService<PlayerType>,
  ) {}

  getType(
    card: Card,
    file: 'playerRaceTypes' | 'playerAssignTypes' | 'playerIdentityTypes',
  ) {
    const type = this[file].data.find(t => t._TypeID === card._TypeRace);
    if (type && type._SystemTextID !== 0) {
      const text = this.SystemTexts.data[type._SystemTextID];
      if (text) {
        return text.Data_Text;
      }
    }
    return null;
  }

  /**************
   * Properties *
   **************/

  @ResolveProperty(type => String)
  Name(@Parent() card: Card) {
    const name = this.nameTexts.data[card.CardID - 1];
    if (name) {
      return name.Message;
    } else {
      return null;
    }
  }

  @ResolveProperty(type => [String])
  ImageStand(@Parent() card: Card) {
    // TODO: extreamly slow
    return this.files._.filter(
      file =>
        !!RegExp(
          `^${(Array(3).join('0') + card.CardID).slice(-3)}_card_\\d\\.png$`,
        ).exec(file.Name),
    )
      .sort(fileSorter)
      .map(file => file.Link)
      .value();
  }

  @ResolveProperty(type => [String])
  ImageCG(@Parent() card: Card) {
    // TODO: extreamly slow
    return this.files._.filter(file => {
      return !!RegExp(
        `^HarlemCG_${(Array(3).join('0') + card.CardID).slice(-3)}_\\d\\.png$`,
      ).exec(file.Name);
    })
      .slice()
      .sort(fileSorter)
      .map(file => file.Link)
      .value();
  }

  @ResolveProperty(type => String)
  IllustName(@Parent() card: Card) {
    return this.statusTexts.data[card.Illust];
  }

  @ResolveProperty(type => String, { nullable: true })
  RaceName(@Parent() card: Card) {
    return this.getType(card, 'playerRaceTypes');
  }

  @ResolveProperty(type => String, { nullable: true })
  AssignName(@Parent() card: Card) {
    return this.getType(card, 'playerAssignTypes');
  }

  @ResolveProperty(type => String, { nullable: true })
  IdentityName(@Parent() card: Card) {
    return this.getType(card, 'playerIdentityTypes');
  }

  @ResolveProperty(type => [SkillsWithType])
  Skills(@Parent() card: Card) {
    const skills: SkillsWithType[] = [];
    if (card.ClassLV0SkillID) {
      skills.push({ Type: 'Init', initSkillID: card.ClassLV0SkillID });
    }
    if (card.ClassLV0SkillID !== card.ClassLV1SkillID) {
      skills.push({ Type: 'CC', initSkillID: card.ClassLV1SkillID });
    }
    if (card.EvoSkillID) {
      skills.push({ Type: 'Evo', initSkillID: card.EvoSkillID });
    }
    return skills;
  }

  /***********
   * Queries *
   ***********/

  @Query(type => [Card], { name: 'cards' })
  getCards() {
    return this.cards.data;
  }

  @Query(type => Card, { nullable: true })
  card(@Args({ name: 'CardID', type: () => Int }) CardID: number) {
    return this.cards.data.find(card => card.CardID === CardID);
  }
}
