import { Resolver, ResolveProperty, Parent, Query } from '@nestjs/graphql';
import { Map } from 'data/models/map.model';
import { MapService } from 'data/map.service';
import { Repository } from 'typeorm';
import { File } from 'data/models/file.model';
import { InjectRepository } from '@nestjs/typeorm';

@Resolver(Map)
export class MapResolver {
  constructor(
    private readonly maps: MapService,
    @InjectRepository(File)
    private readonly files: Repository<File>,
  ) {}

  @ResolveProperty(type => String, { nullable: true })
  async Image(@Parent() map: Map) {
    const file = await this.files.findOne({ Name: `Map${map.MapName}.png` });
    if (file) {
      return file.Link;
    }
  }

  @Query(type => Map, { nullable: true })
  async Map(MapID: number) {
    return this.maps.get(MapID);
  }
}
