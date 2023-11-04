import { RESTDataSource } from 'apollo-datasource-rest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

export class LoginApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.API_URL + '/users/';
  }

  async getUser(userName) {
    const user = await this.get('', { userName }, { cacheOptions: { ttl: 0 } });
    const found = !!user.length;
    if (!found) {
      throw new AuthenticationError('Invalid credentials (User)');
    }

    return user[0];
  }

  async login(userName, password) {
    const user = await this.getUser(userName);

    const { passwordHash, id: userId } = user;

    const isPasswordValid = await this.checkUserPassword(
      password,
      passwordHash,
    );

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials (Password)');
    }

    const token = this.createJwtToken({ userId });
    await this.patch(userId, { token }, { cacheOptions: { ttl: 0 } });

    // Response Header
    this.context.res.cookie('jwtToken', token, {
      secure: false, // Rede Segura HTTPS
      httpOnly: true, // Inacessível via código
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
      path: '/', // Default
      sameSite: 'strict', // strict - lax - none
    });

    return {
      userId,
      token,
    };
  }

  async logout(userName) {
    const user = await this.getUser(userName);

    if (user.id !== this.context.loggedUserId) {
      throw new AuthenticationError('You are not this user');
    }

    await this.patch(user.id, { token: '' }, { cacheOptions: { ttl: 0 } });
    this.context.res.clearCookie('jwtToken');
    return true;
  }
  checkUserPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }

  createJwtToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
}
