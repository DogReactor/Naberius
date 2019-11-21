import { Module, Provider, Inject } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { ConfigService } from 'config/config.service';
import { DataFileService } from './dataFile.service';
import { File } from './models/file.model';
import { join } from 'path';
import { CacheFileService } from './cacheFile.service';
import { CommonModule } from 'common/common.module';
import { RequestService } from 'common/request.service';
import { DataResolver } from './data.resolver';

function dataFactory(fileName: string): Provider {
  return {
    provide: fileName,
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      const service = new DataFileService();
      service.setFilePath(join(config.get('DATA_DIR'), fileName + '.json'));
      return service;
    },
  };
}

function cacheFactory(fileName: string): Provider {
  return {
    provide: fileName,
    inject: [ConfigService, 'FileList', RequestService],
    useFactory: (
      config: ConfigService,
      fileList: DataFileService<File>,
      request: RequestService,
    ) => {
      const service = new CacheFileService(fileList, request);
      service.setFilePath(join(config.get('CACHE_DIR'), fileName + '.json'));
      return service;
    },
  };
}

@Module({
  imports: [ConfigModule, CommonModule],
  providers: [
    DataResolver,
    dataFactory('FileList'),
    dataFactory('CardList'),
    dataFactory('QuestList'),
    cacheFactory('NameText'),
    cacheFactory('StatusText'),
    cacheFactory('PlayerRaceType'),
    cacheFactory('PlayerAssignType'),
    cacheFactory('PlayerIdentityType'),
    cacheFactory('SystemText'),
    cacheFactory('SkillList'),
    cacheFactory('SkillText'),
    cacheFactory('SkillTypeList'),
    cacheFactory('SkillInfluenceConfig'),
  ],
  exports: [
    'FileList',
    'CardList',
    'QuestList',
    'NameText',
    'StatusText',
    'PlayerRaceType',
    'PlayerAssignType',
    'PlayerIdentityType',
    'SystemText',
    'SkillList',
    'SkillText',
    'SkillTypeList',
    'SkillInfluenceConfig',
  ],
})
export class DataModule {}
