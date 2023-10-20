import { RESTDataSource } from 'apollo-datasource-rest';
import { makeUserDataLoader } from './dataloaders';
import {
  createUserFn,
  updateUserFn,
  deleteUserFn,
} from './utils/user-repository';

export class UserApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.API_URL + '/users/';
    this.dataLoader = makeUserDataLoader(this.getUsers.bind(this));
  }

  async getUsers(urlParams = {}) {
    return this.get('', urlParams, {
      cacheOptions: { ttl: 30 },
    });
  }

  async getUser(id) {
    return this.get(id, undefined, {
      cacheOptions: { ttl: 30 },
    });
  }

  async createUser(data) {
    return createUserFn(data, this);
  }

  async updateUser(userId, data) {
    return updateUserFn(userId, data, this);
  }

  async deleteUser(userId) {
    return deleteUserFn(userId, this);
  }

  batchLoadById(id) {
    return this.dataLoader.load(id);
  }
}
