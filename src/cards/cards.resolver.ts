import { Resolver, Query, Args } from '@nestjs/graphql';
import { CardSchema } from './schemas/card.schema';
import { Inject } from '@nestjs/common';
import { StaticFileService } from 'data/staticFile.service';
import { Card } from 'data/models/card.model';
import { Int } from 'type-graphql';

@Resolver(CardSchema)
export class CardsResolver {
  constructor(
    @Inject('CardList') private readonly cardList: StaticFileService<Card>,
  ) {}

  @Query(type => [CardSchema])
  cards() {
    return this.cardList.data;
  }

  @Query(type => CardSchema, { nullable: true })
  card(@Args({ name: 'CardID', type: () => Int }) CardID: number) {
    return this.cardList.data.find(card => card.CardID === CardID);
  }
}
