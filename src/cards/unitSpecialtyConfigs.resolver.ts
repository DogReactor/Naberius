import {
  Resolver,
  ResolveProperty,
  Parent,
  Mutation,
  Args,
} from '@nestjs/graphql';
import { UnitSpecialtyConfig } from 'data/models/unitSpecialtyConfig.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitConfigMeta } from 'data/models/unitConfigMeta.model';
import { Int } from 'type-graphql';
import { Logger } from 'logger/logger.service';

@Resolver(UnitSpecialtyConfig)
export class UnitSpecialtyConfigsResolver {
  constructor(
    @InjectRepository(UnitConfigMeta)
    private readonly unitSpecialtyMetaRepo: Repository<UnitConfigMeta>,
    private readonly logger: Logger,
  ) {}

  @ResolveProperty(type => String, { nullable: true })
  async Comment(@Parent() specialty: UnitSpecialtyConfig) {
    return (
      await this.unitSpecialtyMetaRepo.findOne({
        TypeID: specialty.Type_Specialty,
      })
    )?.Comment;
  }

  @Mutation(type => UnitConfigMeta, { nullable: true })
  async UnitSpecialtyMeta(
    @Args({ name: 'TypeID', type: () => Int }) TypeID: number,
    @Args({ name: 'Comment', type: () => String, nullable: true })
    Comment: string,
  ) {
    try {
      let meta = await this.unitSpecialtyMetaRepo.findOne({ TypeID });
      if (!Comment && meta) {
        await this.unitSpecialtyMetaRepo.delete({ TypeID });
        return null;
      }
      if (!meta) {
        meta = new UnitConfigMeta();
        meta.TypeID = TypeID;
      }
      meta.Comment = Comment;
      await this.unitSpecialtyMetaRepo.save(meta);
      return meta;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }
}
