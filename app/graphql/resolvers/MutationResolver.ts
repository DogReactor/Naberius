import * as _ from 'lodash';
import { parseAL, ALAR } from 'aigis-fuel';
import * as path from 'path';
import * as fs from 'fs-extra';
import bus from '../../bus';
import * as dbs from '../dataFiles';
import {
  requestALTB,
  requestFile,
  PromiseAllPart,
  ALTX2PNG,
  numberPadding,
} from '../utils';
import { ICO_DIR, HARLEM_TEXT_R_DIR, HARLEM_TEXT_A_DIR } from '../../consts';
import { updateCardMeta } from '../connector/CardMetaConnector';
import { updateClassMeta } from '../connector/ClassMetaConnector';
import { updateSkillInfluenceMeta } from '../connector/SkillInfluenceMetaConnector';
import { updateAbilityConfigMeta } from '../connector/AbilityConfigMetaConnector';
import CardConnector from '../connector/CardConnector';
import QuestConnector from '../connector/QuestConnector';
import * as EmojiConnector from '../connector/EmojiConnector';
import { logger } from '../../logger';

export default {
  downloadFiles: async () => {
    bus.status = 1;
    try {
      await Promise.all([
        // NameText.atb
        requestALTB('NameText.atb').then(res => {
          dbs.nameText.write(res);
        }),

        // SkillList.atb
        requestALTB('SkillList.atb').then(res => {
          dbs.skillList.write(res);
        }),

        // SkillText.atb
        requestALTB('SkillText.atb').then(res => {
          dbs.skillText.write(res);
        }),

        // SkillTypeList.atb
        requestALTB('SkillTypeList.atb').then(res => {
          dbs.skillTypeList.write(res);
        }),

        // AbilityList.atb
        requestALTB('AbilityList.atb').then(res => {
          dbs.abilityList.write(res);
        }),

        // AbilityText.atb
        requestALTB('AbilityText.atb').then(res => {
          dbs.abilityText.write(res);
        }),

        // AbilityConfig.atb
        requestALTB('AbilityConfig.atb').then(res => {
          dbs.abilityConfig.write(res);
        }),

        // StatusText.atb
        requestALTB('StatusText.atb').then(res => {
          dbs.statusText.write(res);
        }),

        // StatusText.atb
        requestALTB('SystemText.atb').then(res => {
          dbs.systemText.write(res);
        }),

        // StatusText.atb
        requestALTB('PlayerRaceType.atb').then(res => {
          dbs.playerRaceType.write(res);
        }),

        // SkillInfluenceConfig.atb
        requestALTB('SkillInfluenceConfig.atb').then(res => {
          dbs.skillInfluenceConfig.write(res);
        }),

        // EnemyElem.atb
        requestALTB('EnemyElem.atb').then(res => {
          dbs.enemyElem.write(res);
        }),

        // EnemyType.atb
        requestALTB('EnemyType.atb').then(res => {
          dbs.enemyType.write(res);
        }),

        // QuestEventText.atb
        requestALTB('QuestEventText.atb').then(res => {
          dbs.questEventText.write(res);
        }),

        // HarlemText.aar
        requestFile('HarlemText.aar').then(res => {
          const aar = parseAL(res);
          fs.ensureDirSync(HARLEM_TEXT_R_DIR);
          aar.Files.forEach((file: any) => {
            fs.writeFileSync(
              path.join(HARLEM_TEXT_R_DIR, file.Name),
              file.Content.Buffer,
            );
          });
        }),

        // HarlemEventText0.aar
        requestFile('HarlemEventText0.aar').then(res => {
          const aar = parseAL(res);
          fs.ensureDirSync(HARLEM_TEXT_A_DIR);
          aar.Files.forEach((file: any) => {
            fs.writeFileSync(
              path.join(HARLEM_TEXT_A_DIR, file.Name),
              file.Content.Buffer,
            );
          });
        }),

        // HarlemEventText1.aar
        requestFile('HarlemEventText1.aar').then(res => {
          const aar = parseAL(res);
          fs.ensureDirSync(HARLEM_TEXT_A_DIR);
          aar.Files.forEach((file: any) => {
            fs.writeFileSync(
              path.join(HARLEM_TEXT_A_DIR, file.Name),
              file.Content.Buffer,
            );
          });
        }),

        // prev03.aar
        requestFile('prev03.aar').then(res => {
          const aar = parseAL(res);
          aar.Files.forEach((evaarFile: any) => {
            const match = /(?<=ev)\d+(?=\.aar)/.exec(evaarFile.Name);
            const evaar = evaarFile.Content;
            if (match) {
              const cardID = Number.parseInt(match[0], 10);
              evaar.Files.forEach((atb: any) => {
                if (atb.Name.includes('evtxt')) {
                  const content = JSON.stringify(atb.Content.Contents);
                  fs.writeFileSync(
                    path.join(
                      HARLEM_TEXT_R_DIR,
                      `HarlemText_${numberPadding(cardID, 4)}_2.json`,
                    ),
                    content,
                  );
                }
              });
            }
          });
        }),

        // paev03.aar
        requestFile('paev03.aar').then(res => {
          const aar = parseAL(res);
          aar.Files.forEach((evaarFile: any) => {
            const match = /(?<=ev)\d+(?=\.aar)/.exec(evaarFile.Name);
            const evaar = evaarFile.Content;
            if (match) {
              const cardID = Number.parseInt(match[0], 10);
              evaar.Files.forEach((atb: any) => {
                if (atb.Name.includes('evtxt')) {
                  const content = JSON.stringify(atb.Content.Contents);
                  fs.writeFileSync(
                    path.join(
                      HARLEM_TEXT_A_DIR,
                      `EventText_${numberPadding(cardID, 4)}_2.json`,
                    ),
                    content,
                  );
                }
              });
            }
          });
        }),

        // ClassData.atb
        requestFile('PlayerUnitTable.aar').then(res => {
          const aar = parseAL(res);
          aar.Files.forEach((file: any) => {
            if (file.Name === 'ClassData.atb') {
              const data = file.Content;
              dbs.classData.write(data.Contents);
            }
          });
        }),

        // ico
        Promise.all([
          requestFile('ico_00.aar'),
          requestFile('ico_01.aar'),
          requestFile('ico_02.aar'),
          requestFile('ico_03.aar'),
        ]).then(res => {
          res.forEach((aar: any, index: number) => {
            const parsed = parseAL(aar);
            const dir = path.join(ICO_DIR, index.toString());
            fs.ensureDirSync(dir);
            parsed.Files.forEach((file: any) => {
              const atx = file.Content;
              const image = ALTX2PNG(atx);
              Object.keys(atx.Sprites).forEach((key: string) => {
                const sprite = atx.Sprites[key][0];
                if (sprite.Width !== 0 && sprite.Height !== 0) {
                  const modKey = Number.parseInt(key, 10) % 2048;
                  image
                    .extract({
                      left: sprite.X,
                      top: sprite.Y,
                      width: sprite.Width,
                      height: sprite.Height,
                    })
                    .toFile(path.join(dir, `${modKey}.png`));
                }
              });
            });
          });
        }),

        // wrap MissionQuestList and MissionConfig for daily produce
        Promise.all([
          // MissionQuestList.atb
          Promise.all(
            _.chain(dbs.fileList.data)
              .filter((file: any) => {
                return file.Name.includes('MissionQuestList.atb');
              })
              .map((file: any) =>
                requestFile(file.Name).then(res => parseAL(res).Contents),
              )
              .value(),
          ).then(res => _.flatten(res)),

          // MissionConfig.atb
          Promise.all(
            _.chain(dbs.fileList.data)
              .filter(
                (file: any) =>
                  file.Name.includes('MissionConfig.atb') &&
                  file.Name !== 'EmcMissionConfig.atb',
              )
              .map(file =>
                requestFile(file.Name).then(res =>
                  parseAL(res).Contents.map((obj: { [k: string]: any }) => ({
                    ...obj,
                    Type: file.Name.replace('MissionConfig.atb', ''),
                  })),
                ),
              )
              .value(),
          ).then(res => _.flatten(res)),

          // EventNameText.atb
          requestALTB('EventNameText.atb'),
        ]).then(([missionQuestListArr, missionConfigArr, eventNameArr]) => {
          const missionConfigArrRes = missionConfigArr.filter(
            config => !config.QuestID,
          );
          missionConfigArr
            .filter(config => config.QuestID)
            .forEach(config => {
              missionConfigArrRes.push({
                ...config,
                Name: eventNameArr[config.TitleID].Data_Text,
              });
              config.QuestID.split(',')
                .map((QuestID: string) => Number.parseInt(QuestID, 10))
                .forEach((QuestID: number) => {
                  missionQuestListArr.push({
                    MissionID: config.MissionID,
                    QuestID,
                  });
                });
            });
          dbs.missionConfig.write(missionConfigArrRes);
          dbs.missionQuestList.write(missionQuestListArr);
        }),

        // QuestNameText.atb
        PromiseAllPart(
          _.chain(dbs.fileList.data)
            .filter((file: any) => !!/QuestNameText(\d+)\.atb/.exec(file.Name))
            .map(file => {
              const match = /QuestNameText(\d+)\.atb/.exec(file.Name);
              if (match) {
                return {
                  MissionID: Number.parseInt(match[1], 10),
                  Names: requestFile(file.Name),
                };
              } else {
                return undefined;
              }
            })
            .value(),
          'Names',
        ).then(reses => {
          dbs.questNameText.write(
            reses.map(({ Names, ...res }) => ({
              Names: parseAL(Names).Contents,
              ...res,
            })),
          );
        }),

        // QuestNameText.atb
        PromiseAllPart(
          _.chain(dbs.fileList.data)
            .filter(
              (file: any) => !!/BattleTalkEvent(\d+)\.aar/.exec(file.Name),
            )
            .map(file => {
              const match = /BattleTalkEvent(\d+)\.aar/.exec(file.Name);
              if (match) {
                return {
                  MissionID: Number.parseInt(match[1], 10),
                  Events: requestFile(file.Name),
                };
              } else {
                return undefined;
              }
            })
            .value(),
          'Events',
        ).then(reses => {
          dbs.battleTalkEvent.write(
            reses.map(({ Events, ...res }) => {
              const aar = parseAL(Events) as ALAR;
              let ret: any = {};
              aar.Files.forEach(file => {
                if (file.Name === 'BattleTalkEvent.atb' && file.Content) {
                  ret = file.Content.Contents;
                }
              });
              return {
                Events: ret,
                ...res,
              };
            }),
          );
        }),

        // MessageText.atb
        PromiseAllPart(
          _.chain(dbs.fileList.data)
            .filter((file: any) => !!/MessageText(\d+)\.atb/.exec(file.Name))
            .map(file => {
              const match = /MessageText(\d+)\.atb/.exec(file.Name);
              if (match) {
                return {
                  MissionID: Number.parseInt(match[1], 10),
                  Messages: requestFile(file.Name),
                };
              } else {
                return undefined;
              }
            })
            .value(),
          'Messages',
        ).then(reses => {
          dbs.messageText.write(
            reses.map(({ Messages, ...res }) => ({
              Messages: parseAL(Messages).Contents,
              ...res,
            })),
          );
        }),

        // Enemy.atb
        PromiseAllPart(
          _.chain(dbs.fileList.data)
            .filter((file: any) => !!/Enemy(\d+)\.atb/.exec(file.Name))
            .map(file => {
              const match = /Enemy(\d+)\.atb/.exec(file.Name);
              if (match) {
                return {
                  MissionID: Number.parseInt(match[1], 10),
                  Enemies: requestFile(file.Name),
                };
              }
              return undefined;
            })
            .value(),
          'Enemies',
        ).then(reses => {
          dbs.Enemy.write(
            reses.map(({ Enemies, ...res }) => ({
              Enemies: parseAL(Enemies).Contents,
              ...res,
            })),
          );
        }),
      ]);
    } catch (err) {
      logger.error(err.stack);
      bus.status = 2;
      return false;
    }
    bus.status = 0;
    CardConnector.init();
    QuestConnector.init();
    logger.info('All downloaded!');
    return true;
  },
  updateCardMeta: async (root: any, args: any) => updateCardMeta(args),
  updateClassMeta: async (root: any, args: any) => updateClassMeta(args),
  updateSkillInfluenceMeta: async (root: any, args: any) =>
    updateSkillInfluenceMeta(args),
  updateAbilityConfigMeta: async (root: any, args: any) =>
    updateAbilityConfigMeta(args),
  removeEmoji: async (root: any, args: any) =>
    EmojiConnector.removeEmoji(args.ID),
  removeEmojiItem: async (root: any, args: any) =>
    EmojiConnector.removeEmojiItem(args.ID, args.index),
};
