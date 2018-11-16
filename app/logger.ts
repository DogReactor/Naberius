import chalk from 'chalk';
import bus from './bus';

/**
 * Log level definition.
 */
export enum Level {
  ALL,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  OFF,
}

export class Logger {
  public debug = this.log.bind(this, Level.DEBUG);
  public info = this.log.bind(this, Level.INFO);
  public warn = this.log.bind(this, Level.WARN);
  public error = this.log.bind(this, Level.ERROR);

  private logLevel: Level;

  constructor(level: Level = Level.INFO) {
    this.logLevel = level;
  }

  public log(level: Level, message: string | number) {
    if (this.logLevel <= level) {
      let castColor: any;
      switch (level) {
        case Level.DEBUG:
          castColor = chalk.green.bold('DEBUG');
          break;
        case Level.INFO:
          castColor = chalk.cyan.bold('INFO');
          break;
        case Level.WARN:
          castColor = chalk.yellow.bold('WARN');
          break;
        case Level.ERROR:
          castColor = chalk.red.bold('ERROR');
          break;
        default:
          castColor = chalk.gray.bold('UNKNOWN');
      }
      const log = `[${castColor}] ${chalk.grey(
        new Date().toLocaleString(),
      )} ${message}`;

      bus.log.push(log);

      console.log(log);
    }
  }
}

export const logger = new Logger();
