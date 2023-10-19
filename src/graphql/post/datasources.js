import { RESTDataSource } from 'apollo-datasource-rest';
import { makePostDataLoader } from './dataloaders';
import {
  createPostFn,
  updatePostFn,
  deletePostFn,
} from './utils/post-repository';

export class PostApi extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = process.env.API_URL + '/posts/';
    this.dataLoader = makePostDataLoader((p) => this.getPosts(p));
  }

  async getPosts(urlParams = {}) {
    return this.get('', urlParams, { cacheOptions: { ttl: 30 } });
  }

  async getPost(id) {
    return this.get(id, {}, { cacheOptions: { ttl: 30 } });
  }

  async createPost(postData) {
    return createPostFn(postData, this);
  }

  async updatePost(postId, postData) {
    return updatePostFn(postId, postData, this);
  }

  async deletePost(postId) {
    return deletePostFn(postId, this);
  }

  batchLoadByUserId(id) {
    return this.dataLoader.load(id);
  }
}
