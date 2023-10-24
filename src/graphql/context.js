import jwt from 'jsonwebtoken';
import { UserApi } from './user/datasources';

const authUser = async (req) => {
  const { authorization } = req.headers;
  try {
    const [_bearer, token] = authorization.split(' ');
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    const userApi = new UserApi();
    userApi.initialize({});
    const foundUser = await userApi.getUser(userId);
    if (foundUser.token !== token) return 0;
    return userId;
  } catch (error) {
    return 0;
  }
};

export const context = async ({ req }) => {
  const loggedUserId = await authUser(req);
  return { loggedUserId };
};
