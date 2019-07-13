import * as schedule from 'node-schedule';
import * as moment from 'moment';
import * as request from 'request';
import * as path from 'path';
import * as fs from 'fs-extra';
import { logger } from '../logger';
import { POSTER_ROOT_URL } from '../consts';

class DateParser {
  private date: moment.Moment;

  constructor(date?: string) {
    this.date = moment(date);
  }

  get imgName() {
    return `event${this.date.format('YYYYMMDD')}.jpg`;
  }

  get imgNameWithoutEvent() {
    return `${this.date.format('YYYYMMDD')}.jpg`;
  }

  get isToday() {
    return this.date.isSame(moment(), 'day');
  }

  public nextDay() {
    this.date.add(1, 'd');
  }
}

schedule.scheduleJob('0 30 */1 * * *', () => {
  const date = new DateParser();
  request(`${POSTER_ROOT_URL}/${date.imgName}`).on('response', response => {
    const dir = path.join('static', 'poster');
    const imgPath = path.join(dir, date.imgName);
    if (response.statusCode === 200 && !fs.existsSync(imgPath)) {
      logger.info(`Downloading Img ${date.imgName} ...`);
      fs.ensureDirSync(dir);
      response
        .pipe(fs.createWriteStream(path.join(dir, date.imgName)))
        .on('end', () => {
          logger.info(`Downloaded Img ${date.imgName} !`);
        });
    }
  });
});
