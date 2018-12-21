import * as fs from 'fs-extra';
import * as path from 'path';
import { parseAL, ALAR, ALTX } from 'aigis-fuel';
import { numberPadding, requestFile, ALTX2PNG } from '../utils';
import { ENEMYDOT_IMG_DIR, ENEMYDOT_INFO_DIR } from '../../consts';

export async function grabEnemy(enemy: any) {
  fs.ensureDirSync(ENEMYDOT_IMG_DIR);
  fs.ensureDirSync(ENEMYDOT_INFO_DIR);
  const patternID = (enemy.PatternID >> 8) % 4096;
  const dotImagePath = path.join(ENEMYDOT_IMG_DIR, `${patternID}.png`);
  const dotInfoPath = path.join(ENEMYDOT_INFO_DIR, `${patternID}.json`);
  if (!(fs.existsSync(dotImagePath) && fs.existsSync(dotInfoPath))) {
    const aarFilename = `EnemyDot${numberPadding(patternID, 4)}.aar`;
    const aarFile = parseAL(await requestFile(aarFilename)) as ALAR;
    let existAttack = false;
    for (const file of aarFile.Files) {
      // save a frame image
      if (file.Content && file.Content.Head === 'ALTX') {
        const atx = file.Content as ALTX;
        const sprite = atx.Sprites[Object.keys(atx.Sprites)[0] as any][0];
        await ALTX2PNG(atx)
          .extract({
            left: sprite.X,
            top: sprite.Y,
            height: sprite.Height,
            width: sprite.Width,
          })
          .toFile(dotImagePath);
      }
      if (file.Content && file.Name === 'Attack.aod') {
        existAttack = true;
        fs.writeFileSync(
          dotInfoPath,
          JSON.stringify({ Length: file.Content.ALMT.Length }),
        );
      }
    }
    // no attack animation (don't attack)
    if (!existAttack) {
      fs.writeFileSync(dotInfoPath, JSON.stringify({ Length: 0 }));
    }
  }
}

export function getEnemyDotLength(enemy: any) {
  const patternID = (enemy.PatternID >> 8) % 4096;
  const dotInfoPath = path.join(ENEMYDOT_INFO_DIR, `${patternID}.json`);
  if (!fs.existsSync(dotInfoPath)) {
    return null;
  }
  const dotInfo = JSON.parse(fs.readFileSync(dotInfoPath, 'utf-8'));
  return dotInfo.Length as number;
}
