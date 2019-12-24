import { Resolver, Query } from '@nestjs/graphql';
import { ParsedConfigService } from 'config/config.service';
import { readdir, existsSync, createWriteStream } from 'fs-extra';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';
import * as request from 'request';
import { join } from 'path';
import { Logger } from 'logger/logger.service';

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

@Resolver()
export class PostersResolver {
  constructor(
    private readonly config: ParsedConfigService,
    private readonly logger: Logger,
  ) {}

  @Cron('0 30 */1 * * *')
  updatePoster() {
    const date = new DateParser();
    request(
      `${this.config.get('ASSETS_BASE_URL')}/00/html/image/${date.imgName}`,
    ).on('response', response => {
      const imgPath = join(this.config.get('POSTER_DIR'), date.imgName);
      if (response.statusCode === 200 && !existsSync(imgPath)) {
        this.logger.log(`Downloading Img ${date.imgName} ...`);

        response.pipe(createWriteStream(imgPath)).on('end', () => {
          this.logger.log(`Downloaded Img ${date.imgName} !`);
        });
      }
    });
  }

  @Query(type => [String])
  async Posters() {
    return readdir(this.config.get('POSTER_DIR'));
  }

  @Query(type => [String])
  async Banners() {
    return readdir(this.config.get('BANNER_DIR'));
  }
}
