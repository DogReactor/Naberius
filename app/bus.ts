import { pubsub, LOG_ADDED } from './pubsub';
class Logging<T> extends Array<T> {
  public push(...items: T[]) {
    for (const item of items) {
      pubsub.publish(LOG_ADDED, { logAdded: item });
    }
    while (this.length >= 200) {
      this.shift();
    }
    return super.push(...items);
  }
}

export default {
  /**
   * Server status
   * 0: idle,
   * 1: busy,
   * 2: error
   */
  status: 0,
  log: new Logging<{ Message: string; Level: number }>(),
};
