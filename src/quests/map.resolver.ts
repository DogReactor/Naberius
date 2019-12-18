import { Resolver, ResolveProperty, Parent, Query } from '@nestjs/graphql';
import { Map } from 'data/models/map.model';
import { MapService } from 'data/map.service';
import { FileListService } from 'data/fileList.service';

@Resolver(Map)
export class MapResolver {
  constructor(
    private readonly maps: MapService,
    private readonly files: FileListService,
  ) {}

  @ResolveProperty(type => String, { nullable: true })
  async Image(@Parent() map: Map) {
    const file = this.files.data.find(f => f.Name === `Map${map.MapName}.png`);
    if (file) {
      return file.Link;
    }
  }

  @Query(type => Map, { nullable: true })
  async Map(MapID: number) {
    return this.maps.get(MapID);
  }
}
