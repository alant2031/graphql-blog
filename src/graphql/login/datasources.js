import { RESTDataSource } from 'apollo-datasource-rest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

export class LoginApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.API_URL + '/users/';
  }

  async login(userName, password) {
    const users = await this.get(
      '',
      { userName },
      { cacheOptions: { ttl: 0 } },
    );
    const found = !!users.length;
    if (!found) {
      throw new AuthenticationError('Invalid credentials (User)');
    }

    const { passwordHash, id: userId } = users[0];
    const isPasswordValid = await this.checkUserPassword(
      password,
      passwordHash,
    );

    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid credentials (Password)');
    }

    const token = this.createJwtToken({ userId });
    await this.patch(userId, { token }, { cacheOptions: { ttl: 0 } });
    return {
      userId,
      token,
    };
  }

  checkUserPassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
  }

  createJwtToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }
}
