import { Resolver, Mutation } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { CacheFileService } from './cacheFile.service';

@Resolver()
export class DataResolver {
  constructor(
    @Inject('NameText') private readonly nameTextList: CacheFileService<any>,
    @Inject('StatusText')
    private readonly statusTextList: CacheFileService<any>,
    @Inject('PlayerRaceType')
    private readonly PlayerRaceTypeList: CacheFileService<any>,
    @Inject('PlayerAssignType')
    private readonly PlayerAssignTypeList: CacheFileService<any>,
    @Inject('PlayerIdentityType')
    private readonly PlayerIdentityTypeList: CacheFileService<any>,
    @Inject('SystemText')
    private readonly SystemTextList: CacheFileService<any>,
  ) {}
  @Mutation(returns => Boolean)
  updateFiles() {
    [
      this.nameTextList,
      this.statusTextList,
      this.PlayerRaceTypeList,
      this.PlayerAssignTypeList,
      this.PlayerIdentityTypeList,
      this.SystemTextList,
    ].forEach(service => service.update());
    return true;
  }
}
