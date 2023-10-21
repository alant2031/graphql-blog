import { UserInputError, ValidationError } from 'apollo-server';
import bcrypt from 'bcrypt';

export const createUserFn = async (userData, dataSource) => {
  await checkUserField(userData, true);
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
  await checkUserField(userData);
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

const checkUserField = async (user, allFieldsRequired = false) => {
  const userFields = ['firstName', 'lastName', 'userName', 'password'];

  for (const field of userFields) {
    if (!allFieldsRequired) {
      if (typeof user[field] === 'undefined') continue;
    }

    if (field === 'userName') {
      validateUserName(user[field]);
    }

    if (field === 'password') {
      validateUserPassword(user[field]);
    }

    if (!user[field]) {
      throw new ValidationError(`${field} field is empty`);
    }
  }
  if (user.password && !user.passwordHash) {
    const { password } = user;
    const passwordHash = await bcrypt.hash(password, 6);
    user.passwordHash = passwordHash;
    delete user['password'];
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

const validateUserPassword = (password) => {
  const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
  if (!password.match(strongPasswordRegex)) {
    throw new UserInputError(
      'Password must be at least 6 characters long and include both letters and numbers.',
    );
  }
};
