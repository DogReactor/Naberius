import {
  Resolver,
  Query,
  Args,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { Skin, SkinUnit } from 'data/models/skin.model';
import { Int } from 'type-graphql';
import { CacheFileService } from 'data/cacheFile.service';
import { StatusText } from 'data/models/statusText.model';
import { Dot } from 'data/models/dot.model';
import { SkinService } from 'data/skin.service';
import { SkinDotService } from 'data/skinDot.service';

@Resolver(Skin)
export class SkinResolver {
  constructor(
    @Inject('SkinService')
    private readonly skins: CacheFileService<Skin>,
    @Inject('StatusText')
    private readonly StatusText: CacheFileService<StatusText>,
    private readonly dots: SkinDotService,
  ) {}
  
  @ResolveProperty(type => String)
  Illust(@Parent() skin: Skin) {
    return this.StatusText.data[skin.IllustratorR18].Message;
  }
  
  @ResolveProperty(type => [String])
  async Image(@Parent() skin: Skin) {
    return (this.skins as SkinService).getCG(skin.rowid);
  }
  
  @ResolveProperty(type => [Dot], {nullable: true})
  async Dots(@Parent() skin: Skin) {
    return this.dots.get(skin.rowid);
  }

  //TODO
  @ResolveProperty(type => [SkinUnit], {nullable: true})
  async Units(@Parent() skin: Skin) {
    return [];
  }

  @Query(type => [Skin])
  Skins() {
    return this.skins.data;
  }
  
  @Query(type => Skin, { nullable: true })
  Skin(
    @Args({ name: 'rowid', type: () => Int }) rowid: number,
  ) {
    return this.skins.data[rowid - 1];
  }

}
