import axios from 'axios';
import * as defaults from './defaults';
import { handleError } from './error';

export default class Client {
  constructor(apiKey, options) {
    const config = { ...defaults, ...options };

    const headers = {
      'User-Agent': config.userAgent,
      Authorization: `Bearer ${apiKey}`,
    };

    this.connection = axios.create({
      headers,
      baseURL: `${config.protocol}://${config.host}/${config.apiVersion}/`,
      timeout: config.timeout * 1000,
    });
  }

  async get(path) {
    try {
      const response = await this.connection.get(path);

      return response.data;
    } catch (e) {
      return handleError(e);
    }
  }

  async post(path, data) {
    try {
      const response = await this.connection.post(path, data);

      return response.data;
    } catch (e) {
      return handleError(e);
    }
  }
}
