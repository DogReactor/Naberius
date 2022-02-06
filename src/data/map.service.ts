import { Injectable } from '@nestjs/common';
import { ParsedConfigService } from 'config/config.service';
import { join } from 'path';
import { pathExists, writeFile, readFile } from 'fs-extra';
import { parseAL, ALAR, ALTB, ALTX } from 'aigis-fuel';
import { RequestService } from 'common/request.service';
import { Map, Route } from './models/map.model';
import { ALTX2PNG, numberPadding } from 'common/utils';

@Injectable()
export class MapService {
  constructor(
    private readonly config: ParsedConfigService,
    private readonly request: RequestService,
  ) {}

  async get(MapID: number, MissionID?: number) {
    const MapName = MissionID
      ? `${MissionID}_${numberPadding(MapID, 4)}`
      : MapID;
    const mapPath = join(this.config.get('MAP_DIR'), `${MapName}.json`);
    const mapImagePath = join(this.config.get('MAP_DIR'), `${MapName}.png`);
    if (!(await pathExists(mapPath))) {
      const map = new Map();
      const aarFilename = `Map${MapName}.aar`;
      const aarFile = parseAL(
        await this.request.requestFile(aarFilename),
      ) as ALAR;

      for (const file of aarFile.Files) {
        if (file.Name.includes('Entry')) {
          const match = /Entry(\d+)/.exec(file.Name)!;
          map.Entries[
            Number.parseInt(match[1], 10)
          ] = (file.Content as ALTB).Contents;
        } else if (file.Name.includes('Location')) {
          const match = /Location(\d+)/.exec(file.Name)!;
          map.Locations[
            Number.parseInt(match[1], 10)
          ] = (file.Content as ALTB).Contents;
        } else if (file.Name.includes('Route')) {
          const routes = (file.Content as ALTB).Contents;
          routes.forEach(route => {
            Object.keys(route).forEach(key => {
              route[key.replace('@', '')] = route[key];
              delete route[key];
            });
          });
          const match = /Route(\d+)/.exec(file.Name)!;
          map.Routes[Number.parseInt(match[1], 10)] = routes;
        } else if (file.Name.includes('Enemy')) {
          map.Enemies = (file.Content as ALTB).Contents;
        } else if (file.Name === 'Map.atx') {
          try {
            const content = file.Content as ALTX;
            await ALTX2PNG(content).toFile(mapImagePath);
          } catch (e) {
            console.error(e as Error);
          }
        }
      }

      await writeFile(mapPath, JSON.stringify(map));
    }

    return {
      ...JSON.parse(await readFile(mapPath, 'utf-8')),
      MapID,
      MapName,
    } as Map;
  }
}
