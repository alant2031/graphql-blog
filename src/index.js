import { ApolloServerPluginLandingPageGraphQLPlayground } from '@apollo/server-plugin-landing-page-graphql-playground';
import { ApolloServer } from 'apollo-server';

import { context } from './graphql/context';

import { LoginApi } from './graphql/login/datasources';
import { PostApi } from './graphql/post/datasources';
import { UserApi } from './graphql/user/datasources';

import { resolvers, typeDefs } from './graphql/schema';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  dataSources: () => {
    return {
      postApi: new PostApi(),
      userApi: new UserApi(),
      loginApi: new LoginApi(),
    };
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],

  cors: {
    origin: ['*'],
    credentials: true,
  },
});

server.listen(4003).then(({ url }) => {
  console.log(`Server listening on url ${url}`);
});
