const request = require('request');
const moment = require('moment');
const fs = require('fs-extra');
const path = require('path');
const ROOT_URL = 'http://assets.millennium-war.net/00/html/image/';

class DateParser {
  constructor(date) {
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

  nextDay() {
    this.date.add(1, 'd');
  }
}

const date = new DateParser('2015-01-01');
while (!date.isToday) {
  (date =>
    request(`${ROOT_URL}${date.imgName}`).on('response', response => {
      if (response.statusCode === 200) {
        console.log(`Downloading Img ${date.imgName} ...`);
        const dir = path.join('static', 'poster');
        fs.ensureDirSync(dir);
        response.pipe(fs.WriteStream(path.join(dir, date.imgNameWithoutEvent)));
      } else {
        console.log(`Img ${date.imgName} not exists.`);
      }
    }))(new DateParser(date.date));
  date.nextDay();
}
