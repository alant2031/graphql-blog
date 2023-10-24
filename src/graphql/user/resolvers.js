import { checkOwner } from '../login/utils/login-functions';

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
  checkOwner(userId, loggedUserId);
  return dataSources.userApi.updateUser(userId, data);
};
const deleteUser = (_, { userId }, { dataSources, loggedUserId }) => {
  checkOwner(userId, loggedUserId);
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
