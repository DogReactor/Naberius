import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
  Mutation,
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
import { HarlemTextService } from 'data/harlemText.service';
import { Class } from 'data/models/class.model';
import { ClassDataService } from 'data/class.service';
import { Ability } from 'data/models/ability.model';
import { DotService } from 'data/dot.service';
import { Dot } from 'data/models/dot.model';
import { InjectRepository } from '@nestjs/typeorm';
import { CardMeta } from 'data/models/cardMeta.model';
import { Repository } from 'typeorm';
import { UnitSpecialtyConfig } from 'data/models/unitSpecialtyConfig.model';
import { PlayerCGService } from 'data/playerCG.service';

@Resolver(Card)
export class CardsResolver {
  constructor(
    @Inject('CardList') private readonly cards: DataFileService<Card>,
    @InjectRepository(File)
    private readonly files: Repository<File>,
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
    @Inject('PlayerGenusType')
    private readonly playerGenusTypes: CacheFileService<PlayerType>,
    private readonly harlemTexts: HarlemTextService,
    private readonly classes: ClassDataService,
    @Inject('AbilityList')
    private readonly abilities: CacheFileService<Ability>,
    @Inject('UnitSpecialty')
    private readonly unitSpecialtyConfigs: CacheFileService<
      UnitSpecialtyConfig
    >,
    private readonly dots: DotService,
    private readonly playerCGs: PlayerCGService,
    @InjectRepository(CardMeta)
    private readonly cardMetaRepo: Repository<CardMeta>,
  ) {}

  getType(
    card: Card,
    file:
      | 'playerRaceTypes'
      | 'playerAssignTypes'
      | 'playerIdentityTypes'
      | 'playerGenusTypes',
  ) {
    let key: string;
    switch (file) {
      case 'playerRaceTypes':
        key = card._TypeRace;
        break;
      case 'playerAssignTypes':
        key = card.Assign;
        break;
      case 'playerIdentityTypes':
        key = card.Identity;
        break;
      case 'playerGenusTypes':
        key = card.Genus;
        break;
      default:
        throw new Error('Type file name error!');
    }
    const type = this[file].data.find(
      t => t._TypeID === Number.parseInt(key, 10),
    );
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
    const name = this.nameTexts.data[Number.parseInt(card.CardID, 10) - 1];
    if (name) {
      return name.Message;
    } else {
      return null;
    }
  }

  @ResolveProperty(type => [String])
  async ImageStand(@Parent() card: Card) {
    return this.playerCGs.get(Number.parseInt(card.CardID, 10), 'Stand');
  }

  @ResolveProperty(type => [String])
  async ImageCG(@Parent() card: Card) {
    return this.playerCGs.get(Number.parseInt(card.CardID, 10), 'Harlem');
  }

  @ResolveProperty(type => String)
  IllustName(@Parent() card: Card) {
    return this.statusTexts.data[Number.parseInt(card.Illust, 10)].Message;
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

  @ResolveProperty(type => String, { nullable: true })
  GenusName(@Parent() card: Card) {
    return this.getType(card, 'playerGenusTypes');
  }

  @ResolveProperty(type => [SkillsWithType])
  Skills(@Parent() card: Card) {
    const skills: SkillsWithType[] = [];
    if (card.ClassLV0SkillID) {
      skills.push({
        Type: 'Init',
        initSkillID: Number.parseInt(card.ClassLV0SkillID, 10),
      });
    }
    if (card.ClassLV0SkillID !== card.ClassLV1SkillID) {
      skills.push({
        Type: 'CC',
        initSkillID: Number.parseInt(card.ClassLV1SkillID, 10),
      });
    }
    if (card.EvoSkillID) {
      skills.push({
        Type: 'Evo',
        initSkillID: Number.parseInt(card.EvoSkillID, 10),
      });
    }
    return skills;
  }

  @ResolveProperty(type => [Ability])
  Abilities(@Parent() card: Card) {
    const abilities: Ability[] = [];
    if (card.Ability_Default) {
      abilities.push({
        Type: 'Init',
        ...this.abilities.data.find(
          a => a.AbilityID === Number.parseInt(card.Ability_Default, 10),
        )!,
      });
    }
    if (card.Ability) {
      abilities.push({
        Type: 'Evo',
        ...this.abilities.data.find(
          a => a.AbilityID === Number.parseInt(card.Ability, 10),
        )!,
      });
    }
    return abilities;
  }

  @ResolveProperty(type => [String])
  HarlemTextA(@Parent() card: Card) {
    return this.harlemTexts.get(card.CardID, 'A');
  }

  @ResolveProperty(type => [String])
  HarlemTextR(@Parent() card: Card) {
    return this.harlemTexts.get(card.CardID, 'R');
  }

  @ResolveProperty(type => [Class])
  Classes(@Parent() card: Card) {
    const classes: Class[] = [];
    // init class
    classes.push({
      ...this.classes.data.find(
        cl => cl.ClassID === Number.parseInt(card.InitClassID, 10),
      )!,
      Type: 'Init',
    });

    // Init -> CC || Init -> Evo
    if (classes[0].JobChange) {
      classes.push({
        ...this.classes.data.find(cl => cl.ClassID === classes[0].JobChange)!,
        Type: classes[0].Data_ExtraAwakeOrb1 ? 'Evo' : 'CC',
      });
    }

    // CC -> Evo
    if (classes[classes.length - 1].Type === 'CC') {
      const CCClass = classes[classes.length - 1];
      if (CCClass.JobChange) {
        classes.push({
          ...this.classes.data.find(cl => cl.ClassID === CCClass.JobChange)!,
          Type: 'Evo',
        });
      }
    }

    // Evo -> Evo2a && Evo2b
    if (classes[classes.length - 1].Type === 'Evo') {
      const EvoClass = classes[classes.length - 1];
      if (EvoClass.AwakeType1) {
        classes.push({
          ...this.classes.data.find(cl => cl.ClassID === EvoClass.AwakeType1)!,
          Type: 'Evo2a',
        });
        classes.push({
          ...this.classes.data.find(cl => cl.ClassID === EvoClass.AwakeType2)!,
          Type: 'Evo2b',
        });
      }
    }
    return classes;
  }

  @ResolveProperty(type => [Dot], { nullable: true })
  async Dots(@Parent() card: Card) {
    return this.dots.get(card.CardID, 'Player');
  }

  @ResolveProperty(type => [String], { nullable: true })
  async NickNames(@Parent() card: Card) {
    const meta = await this.cardMetaRepo.findOne({
      CardID: Number.parseInt(card.CardID, 10),
    });
    if (meta) {
      return meta.NickNames;
    }
  }

  @ResolveProperty(type => String, { nullable: true })
  async ConneName(@Parent() card: Card) {
    const meta = await this.cardMetaRepo.findOne({
      CardID: Number.parseInt(card.CardID, 10),
    });
    if (meta) {
      return meta.ConneName;
    }
  }

  @ResolveProperty(type => [UnitSpecialtyConfig])
  async SpecialtyConfigs(@Parent() card: Card) {
    let index = this.unitSpecialtyConfigs.data.findIndex(
      us => us.ID_Card === Number.parseInt(card.CardID),
    );
    if (index !== -1) {
      const configs: UnitSpecialtyConfig[] = [];
      let config = this.unitSpecialtyConfigs.data[index];
      while (
        config &&
        (config.ID_Card === 0 ||
          config.ID_Card === Number.parseInt(card.CardID))
      ) {
        configs.push(config);
        config = this.unitSpecialtyConfigs.data[++index];
      }
      return configs;
    }
    return [];
  }

  /***********
   * Queries *
   ***********/

  @Query(type => [Card])
  Cards(
    @Args({ name: 'ClassID', type: () => Int, nullable: true })
    ClassID?: number,
    @Args({ name: 'Rare', type: () => Int, nullable: true })
    Rare?: number,
  ) {
    if (Rare !== undefined) {
      return this.cards.data.filter(
        card => Number.parseInt(card.Rare, 10) === Rare,
      );
    }
    if (ClassID) {
      return this.cards.data.filter(
        card => Number.parseInt(card.InitClassID, 10) === ClassID,
      );
    }
    return this.cards.data;
  }

  @Query(type => Card, { nullable: true })
  Card(
    @Args({ name: 'CardID', type: () => Int, nullable: true }) CardID?: number,
    @Args({ name: 'Name', type: () => String, nullable: true }) Name?: string,
  ) {
    if (Name) {
      CardID = this.nameTexts.data.findIndex(name => name.Message === Name) + 1;
    }
    if (CardID) {
      return this.cards.data.find(
        card => Number.parseInt(card.CardID, 10) === CardID,
      );
    }
  }

  /*************
   * Mutations *
   *************/

  @Mutation(type => Card, { nullable: true })
  async CardMeta(
    @Args({ name: 'CardID', type: () => Int }) CardID: number,
    @Args({ name: 'ConneName', type: () => String, nullable: true })
    ConneName: string,
    @Args({ name: 'NickNames', type: () => [String], nullable: true })
    NickNames: [string],
  ) {
    try {
      const card = this.cards.data.find(
        card => Number.parseInt(card.CardID, 10) === CardID,
      );
      if (!card) {
        return null;
      }
      let meta = await this.cardMetaRepo.findOne({ CardID });
      if (meta && !NickNames && !ConneName) {
        await this.cardMetaRepo.delete({ CardID });
        return;
      }
      if (!meta) {
        meta = new CardMeta();
        meta.CardID = CardID;
      }
      if (typeof ConneName === 'string') {
        meta.ConneName = ConneName;
      }
      if (NickNames instanceof Array) {
        meta.NickNames = NickNames;
      }
      await this.cardMetaRepo.save(meta);
      return card;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}
