import { ValidationError } from 'apollo-server';

export const createUserFn = async (userData, dataSource) => {
  checkUserField(userData, true);
  const indexRefUser = await dataSource.get('', {
    _limit: 1,
    _sort: 'indexRef',
    _order: 'desc',
  });
  const indexRef = indexRefUser[0].indexRef + 1;
  const foundUser = await userExists(userData.userName, dataSource);
  if (typeof foundUser !== 'undefined') {
    throw new ValidationError(
      `userName ${userData.userName} has already been taken`,
    );
  }

  return dataSource.post('', {
    ...userData,
    indexRef,
    createdAt: new Date().toISOString(),
  });
};

export const updateUserFn = async (userId, userData, dataSource) => {
  checkUserField(userData);
  if (!userId) throw new ValidationError('UserId is required');
  if (userData.userName) {
    const foundUser = await userExists(userData.userName, dataSource);
    if (typeof foundUser !== 'undefined' && foundUser.if !== userId) {
      throw new ValidationError(
        `userName ${userData.userName} has already been taken`,
      );
    }
  }
  return dataSource.patch(userId, { ...userData });
};

export const deleteUserFn = async (userId, dataSource) => {
  if (!userId) throw new ValidationError('UserId is required');
  return !!(await dataSource.delete(userId));
};

const checkUserField = (user, allFieldsRequired = false) => {
  const userFields = ['firstName', 'lastName', 'userName'];

  for (const field of userFields) {
    if (!allFieldsRequired) {
      if (typeof user[field] === 'undefined') continue;
    }

    if (field === 'userName') {
      validateUserName(user[field]);
    }

    if (!user[field]) {
      throw new ValidationError(`${field} field is empty`);
    }
  }
};

const userExists = async (userName, dataSource) => {
  const found = await dataSource.get('', { userName }); // /users/?userName=nomeBuscado
  return found[0];
};

const validateUserName = (userName) => {
  const userNameRegExp = /^[a-z]([a-z0-9_.-]+)+$/gi;

  if (!userName.match(userNameRegExp)) {
    throw new ValidationError(`userName must match ${userNameRegExp}`);
  }
};
