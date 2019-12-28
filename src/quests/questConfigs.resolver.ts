import {
  Resolver,
  ResolveProperty,
  Parent,
  Mutation,
  Args,
} from '@nestjs/graphql';
import { QuestTermConfig } from 'data/models/questTermConfig.model';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestConfigMeta } from 'data/models/questConfigMeta.model';
import { Repository } from 'typeorm';
import { Logger } from 'logger/logger.service';
import { Int } from 'type-graphql';

@Resolver(QuestTermConfig)
export class QuestConfigsResolver {
  constructor(
    @InjectRepository(QuestConfigMeta)
    private readonly questConfigMetaRepo: Repository<QuestConfigMeta>,
    private readonly logger: Logger,
  ) {}

  @ResolveProperty(type => String, { nullable: true })
  async Comment(@Parent() config: QuestTermConfig) {
    return (
      await this.questConfigMetaRepo.findOne({
        TypeID: config.Type_Influence,
      })
    )?.Comment;
  }

  @Mutation(type => QuestConfigMeta, { nullable: true })
  async QuestConfigMeta(
    @Args({ name: 'TypeID', type: () => Int }) TypeID: number,
    @Args({ name: 'Comment', type: () => String, nullable: true })
    Comment: string,
  ) {
    try {
      let meta = await this.questConfigMetaRepo.findOne({ TypeID });
      if (!Comment && meta) {
        await this.questConfigMetaRepo.delete({ TypeID });
        return null;
      }
      if (!meta) {
        meta = new QuestConfigMeta();
        meta.TypeID = TypeID;
      }
      meta.Comment = Comment;
      await this.questConfigMetaRepo.save(meta);
      return meta;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }
}
