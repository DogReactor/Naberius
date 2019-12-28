import {
  Resolver,
  ResolveProperty,
  Mutation,
  Parent,
  Args,
} from '@nestjs/graphql';
import { AbilityConfig } from 'data/models/abilityConfig.model';
import { AbilityConfigMeta } from 'data/models/abilityConfigMeta.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from 'logger/logger.service';
import { Int } from 'type-graphql';

@Resolver(AbilityConfig)
export class AbilityConfigsResolver {
  constructor(
    @InjectRepository(AbilityConfigMeta)
    private readonly abilityConfigMetaRepo: Repository<AbilityConfigMeta>,
    private readonly logger: Logger,
  ) {}
  @ResolveProperty(type => String, { nullable: true })
  async Comment(@Parent() config: AbilityConfig) {
    return (
      await this.abilityConfigMetaRepo.findOne({
        TypeID: config._InfluenceType,
      })
    )?.Comment;
  }

  @Mutation(type => AbilityConfigMeta, { nullable: true })
  async AbilityConfigMeta(
    @Args({ name: 'TypeID', type: () => Int }) TypeID: number,
    @Args({ name: 'Comment', type: () => String, nullable: true })
    Comment: string,
  ) {
    try {
      let meta = await this.abilityConfigMetaRepo.findOne({ TypeID });
      if (!Comment && meta) {
        await this.abilityConfigMetaRepo.delete({ TypeID });
        return null;
      }
      if (!meta) {
        meta = new AbilityConfigMeta();
        meta.TypeID = TypeID;
      }
      meta.Comment = Comment;
      await this.abilityConfigMetaRepo.save(meta);
      return meta;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }
}
