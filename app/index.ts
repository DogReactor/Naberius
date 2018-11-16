import { ApolloServer } from 'apollo-server-koa';
import * as Koa from 'koa';
import * as Static from 'koa-static';
import * as Router from 'koa-router';
import * as Mount from 'koa-mount';
import * as CORS from '@koa/cors';
import * as Compress from 'koa-compress';
import * as Body from 'koa-body';
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/schema';
import uploadOrigin from './middlewares/uploadOrigin';
import { PORT, HOST } from './consts';

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
app.use(Compress());
app.use(router.routes());
app.use(Mount('/static', Static('static')));

server.applyMiddleware({ app });

app.listen({ port: PORT, host: HOST }, () =>
  console.log(`🚀 Server ready at http://${HOST}:${PORT}${server.graphqlPath}`),
);
