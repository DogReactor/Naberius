import {
  Resolver,
  ResolveProperty,
  Parent,
  Mutation,
  Args,
} from '@nestjs/graphql';
import { EnemySpecialtyConfig } from 'data/models/enemySpecialtyConfig.model';
import { InjectRepository } from '@nestjs/typeorm';
import { EnemyConfigMeta } from 'data/models/enemyConfigMeta.model';
import { Repository } from 'typeorm';
import { Logger } from 'logger/logger.service';
import { Int } from 'type-graphql';

@Resolver(EnemySpecialtyConfig)
export class EnemyConfigsResolver {
  constructor(
    @InjectRepository(EnemyConfigMeta)
    private readonly enemyConfigMetaRepo: Repository<EnemyConfigMeta>,
    private readonly logger: Logger,
  ) {}

  @ResolveProperty(type => String, { nullable: true })
  async Comment(@Parent() config: EnemySpecialtyConfig) {
    return (
      await this.enemyConfigMetaRepo.findOne({
        TypeID: config.Type_Influence,
      })
    )?.Comment;
  }

  @Mutation(type => EnemyConfigMeta, { nullable: true })
  async EnemyConfigMeta(
    @Args({ name: 'TypeID', type: () => Int }) TypeID: number,
    @Args({ name: 'Comment', type: () => String, nullable: true })
    Comment: string,
  ) {
    try {
      let meta = await this.enemyConfigMetaRepo.findOne({ TypeID });
      if (!Comment && meta) {
        await this.enemyConfigMetaRepo.delete({ TypeID });
        return null;
      }
      if (!meta) {
        meta = new EnemyConfigMeta();
        meta.TypeID = TypeID;
      }
      meta.Comment = Comment;
      await this.enemyConfigMetaRepo.save(meta);
      return meta;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }
}
