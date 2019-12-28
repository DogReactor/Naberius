import {
  Resolver,
  ResolveProperty,
  Parent,
  Mutation,
  Args,
} from '@nestjs/graphql';
import { SkillInfluenceConfig } from 'data/models/skillInfluenceConfig.model';
import { InjectRepository } from '@nestjs/typeorm';
import { SkillConfigMeta } from 'data/models/skillConfigMeta.model';
import { Repository } from 'typeorm';
import { Int } from 'type-graphql';
import { Logger } from 'logger/logger.service';

@Resolver(SkillInfluenceConfig)
export class SkillConfigsResolver {
  constructor(
    @InjectRepository(SkillConfigMeta)
    private readonly skillConfigMetaRepo: Repository<SkillConfigMeta>,
    private readonly logger: Logger,
  ) {}

  @ResolveProperty(type => String, { nullable: true })
  async Comment(@Parent() config: SkillInfluenceConfig) {
    return (
      await this.skillConfigMetaRepo.findOne({
        TypeID: config.Data_InfluenceType,
      })
    )?.Comment;
  }

  @Mutation(type => SkillConfigMeta, { nullable: true })
  async SkillConfigMeta(
    @Args({ name: 'TypeID', type: () => Int }) TypeID: number,
    @Args({ name: 'Comment', type: () => String, nullable: true })
    Comment: string,
  ) {
    try {
      let meta = await this.skillConfigMetaRepo.findOne({ TypeID });
      if (!Comment && meta) {
        await this.skillConfigMetaRepo.delete({ TypeID });
        return null;
      }
      if (!meta) {
        meta = new SkillConfigMeta();
        meta.TypeID = TypeID;
      }
      meta.Comment = Comment;
      await this.skillConfigMetaRepo.save(meta);
      return meta;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }
}
