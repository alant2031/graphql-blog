import { ValidationError } from 'apollo-server';

export const createPostFn = async (postData, dataSource) => {
  const postInfo = await createPostInfo(postData, dataSource);
  const { title, body, userId } = postInfo;
  if (!title || !body || !userId) {
    throw new ValidationError('Empty fields not allowed');
  }
  return dataSource.post('', { ...postInfo });
};

export const updatePostFn = async (postId, postData, dataSource) => {
  if (!postId) {
    throw new ValidationError('Missing postId');
  }

  const { title, body, userId } = postData;

  if (typeof title !== 'undefined') {
    if (!title) {
      throw new ValidationError('title field is empty');
    }
  }
  if (typeof body !== 'undefined') {
    if (!body) {
      throw new ValidationError('body field is empty');
    }
  }
  if (typeof userId !== 'undefined') {
    if (!userId) {
      throw new ValidationError('userId field is empty');
    }
    await userExists(userId, dataSource);
  }
  return dataSource.patch(postId, { ...postData });
};

export const deletePostFn = async (postId, dataSource) => {
  if (!postId) {
    throw new ValidationError('Missing postId');
  }
  const deleted = await dataSource.delete(postId);
  return !!deleted;
};

const userExists = async (userId, dataSource) => {
  try {
    await dataSource.context.dataSources.userApi.get(userId);
  } catch (err) {
    throw new ValidationError(`User ${userId} does not exist`);
  }
};

const createPostInfo = async (postData, dataSource) => {
  console.log(postData);
  const { title, body, userId } = postData;

  await userExists(userId, dataSource);

  const indexRefPost = await dataSource.get('', {
    _limit: 1,
    _sort: 'indexRef',
    _order: 'desc',
  });

  const indexRef = indexRefPost[0].indexRef + 1;
  return {
    title,
    body,
    userId,
    indexRef,
    createdAt: new Date().toISOString(),
  };
};
