import { Module, Provider, Inject } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { ConfigService } from 'config/config.service';
import { DataFileService } from './dataFile.service';
import { join } from 'path';
import { CacheFileService } from './cacheFile.service';
import { CommonModule } from 'common/common.module';
import { RequestService } from 'common/request.service';
import { DataResolver } from './data.resolver';
import { FileListService } from './fileList.service';
import { HarlemTextService } from './harlemText.service';
import { ClassDataService } from './class.service';
import { MissionConfigService } from './missionConfig.service';
import { QuestNameTextService } from './questNameText.service';

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
    inject: [ConfigService, RequestService],
    useFactory: (config: ConfigService, request: RequestService) => {
      const service = new CacheFileService(request);
      service.setFilePath(join(config.get('CACHE_DIR'), fileName + '.json'));
      return service;
    },
  };
}

@Module({
  imports: [ConfigModule, CommonModule],
  providers: [
    DataResolver,
    FileListService,
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
    cacheFactory('AbilityList'),
    cacheFactory('AbilityText'),
    cacheFactory('AbilityConfig'),
    cacheFactory('ClassBattleStyleConfig'),
    HarlemTextService,
    ClassDataService,
    MissionConfigService,
    QuestNameTextService,
  ],
  exports: [
    FileListService,
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
    'AbilityList',
    'AbilityText',
    'AbilityConfig',
    'ClassBattleStyleConfig',
    HarlemTextService,
    ClassDataService,
    MissionConfigService,
    QuestNameTextService,
  ],
})
export class DataModule {}
