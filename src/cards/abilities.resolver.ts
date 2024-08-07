import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { Ability } from 'data/models/ability.model';
import { CacheFileService } from 'data/cacheFile.service';
import { Inject } from '@nestjs/common';
import { AbilityText } from 'data/models/abilityText.model';
import { Int } from 'type-graphql';
import { AbilityConfig } from 'data/models/abilityConfig.model';
import { DataService } from 'data/data.service';
import { Card } from 'data/models/card.model';

@Resolver(Ability)
export class AbilitiesResolver {
  constructor(
    @Inject('AbilityList')
    private readonly abilities: CacheFileService<Ability>,
    @Inject('AbilityText')
    private readonly abilityTexts: CacheFileService<AbilityText>,
    @Inject('AbilityConfig')
    private readonly abilityConfigs: CacheFileService<AbilityConfig>,
    @Inject('CardList')
    private readonly cards: DataService<Card>,
  ) {}

  @ResolveProperty(type => String, { nullable: true })
  Text(@Parent() ability: Ability) {
    let index = this.abilityTexts.data.findIndex(
	    at => at.AbilityTextID === ability.AbilityTextID,
	);
    const text = this.abilityTexts.data[index];
    return text ? text.AbilityText : null;
  }

  @ResolveProperty(type => [AbilityConfig])
  Configs(@Parent() ability: Ability) {
    if (ability._ConfigID === 0) {
      return [];
    }
    let index = this.abilityConfigs.data.findIndex(
      ac => ac._ConfigID === ability._ConfigID,
    );
    if (index !== -1) {
      const configs: AbilityConfig[] = [];
      let config = this.abilityConfigs.data[index];
      while (
        config &&
        (config._ConfigID === 0 || config._ConfigID === ability._ConfigID)
      ) {
        configs.push(config);
        config = this.abilityConfigs.data[++index];
      }
      return configs;
    }
    return [];
  }

  @ResolveProperty(type => [Card])
  Cards(@Parent() ability: Ability) {
    return this.cards.data.filter(
      card =>
        Number.parseInt(card.Ability_Default, 10) === ability.AbilityID ||
        Number.parseInt(card.Ability, 10) === ability.AbilityID,
    );
  }

  @Query(type => [Ability])
  Abilities() {
    return this.abilities.data;
  }

  @Query(type => Ability)
  Ability(@Args({ name: 'AbilityID', type: () => Int }) AbilityID: number) {
    return this.abilities.data.find(ab => ab.AbilityID === AbilityID);
  }
}
