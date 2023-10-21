import { AuthenticationError } from 'apollo-server';

// Query resolvers
const user = async (_, { id }, { dataSources }) => {
  const user = await dataSources.userApi.getUser(id);
  return user;
};

const users = async (_, { input }, { dataSources }) => {
  const users = await dataSources.userApi.getUsers(input);
  return users;
};

//Mutation resolvers
const createUser = (_, { data }, { dataSources }) => {
  return dataSources.userApi.createUser(data);
};
const updateUser = (_, { userId, data }, { dataSources, loggedUserId }) => {
  if (!loggedUserId) {
    throw new AuthenticationError('You have to log in');
  }

  if (loggedUserId !== userId) {
    throw new AuthenticationError('You can not update this user');
  }
  return dataSources.userApi.updateUser(userId, data);
};
const deleteUser = (_, { userId }, { dataSources }) => {
  return dataSources.userApi.deleteUser(userId);
};

// Fields resolvers
const posts = ({ id }, _, { dataSources }) => {
  return dataSources.postApi.batchLoadByUserId(id);
};

export const userResolvers = {
  Query: { user, users },
  Mutation: { createUser, updateUser, deleteUser },
  User: { posts },
};
