import { Module, Provider, Inject } from '@nestjs/common';
import { ConfigModule } from 'config/config.module';
import { ConfigService } from 'config/config.service';
import { DataFileService } from './dataFile.service';
import { join } from 'path';
import { CacheFileService } from './cacheFile.service';
import { CommonModule } from 'common/common.module';
import { RequestService } from 'common/request.service';
import { DataResolver } from './data.resolver';
import { HarlemTextService } from './harlemText.service';
import { ClassDataService } from './class.service';
import { MissionConfigService } from './missionConfig.service';
import { QuestNameTextService } from './questNameText.service';
import { IcoService } from './ico.service';
import { EventArcService } from './eventArc.service';
import { DotService } from './dot.service';
import { MessageTextService } from './messageText.service';
import { BattleTalkEventService } from './battleTalkEvent.service';
import { MapService } from './map.service';
import { EnemyService } from './enemy.service';
import { BannerService } from './banner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './models/file.model';

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
  imports: [ConfigModule, CommonModule, TypeOrmModule.forFeature([File])],
  providers: [
    DataResolver,
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
    cacheFactory('QuestEventText'),
    cacheFactory('EnemyType'),
    cacheFactory('EnemyElem'),
    cacheFactory('QuestTermConfig'),
    cacheFactory('EnemySpecialty_Config'),
    HarlemTextService,
    ClassDataService,
    MissionConfigService,
    QuestNameTextService,
    MessageTextService,
    IcoService,
    EventArcService,
    DotService,
    BattleTalkEventService,
    MapService,
    EnemyService,
    BannerService,
  ],
  exports: [
    DataResolver,
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
    'QuestEventText',
    'EnemyType',
    'EnemyElem',
    'QuestTermConfig',
    'EnemySpecialty_Config',
    HarlemTextService,
    ClassDataService,
    MissionConfigService,
    QuestNameTextService,
    MessageTextService,
    EventArcService,
    DotService,
    BattleTalkEventService,
    MapService,
    EnemyService,
    BannerService,
  ],
})
export class DataModule {}
