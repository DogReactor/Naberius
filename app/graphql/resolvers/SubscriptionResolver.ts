import { pubsub, LOG_ADDED } from '../../pubsub';

export default {
  logAdded: {
    subscribe: () => pubsub.asyncIterator([LOG_ADDED]),
  },
};
