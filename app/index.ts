import { ApolloServer } from 'apollo-server-koa';
import * as Koa from 'koa';
import * as Static from 'koa-static';
import * as Router from 'koa-router';
import * as Mount from 'koa-mount';
import * as CORS from '@koa/cors';
import * as Body from 'koa-body';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/schema';
import uploadOrigin from './middlewares/uploadOrigin';
import { logger } from './logger';
import { PORT, HOST, STATIC_DIR } from './consts';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // tracing: true,
});

const app = new Koa();

const router = new Router();

router.post(
  '/upload-origin',
  Body({
    multipart: true,
    formidable: {
      maxFileSize: 10 * 1024 * 1024,
    },
  }),
  uploadOrigin,
);

app.use(CORS());
app.use(router.routes());
app.use(Mount('/static', Static(STATIC_DIR)));

server.applyMiddleware({ app });

const koaServer = app.listen({ port: PORT, host: HOST }, () =>
  logger.info(`🚀 Server ready at http://${HOST}:${PORT}${server.graphqlPath}`),
);

const subscriptionServer = new SubscriptionServer(
  {
    execute,
    subscribe,
    schema,
  },
  {
    server: koaServer,
    path: '/graphql',
  },
);
