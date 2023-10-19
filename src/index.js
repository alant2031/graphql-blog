import { ApolloServer } from 'apollo-server';

import { context } from './graphql/context';

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
    };
  },
});

server.listen(4003).then(({ url }) => {
  console.log(`Server listening on url ${url}`);
});
