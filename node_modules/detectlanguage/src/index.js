import Client from './client';

class API {
  constructor(apiKey, options = {}) {
    this.client = new Client(apiKey, options);
  }

  async detect(text) {
    const response = await this.client.post('detect', { q: text });

    return response.data.detections;
  }

  async detectCode(text) {
    const results = await this.detect(text);

    return results[0]?.language || null;
  }

  async languages() {
    return this.client.get('languages');
  }

  async userStatus() {
    return this.client.get('user/status');
  }
}

module.exports = API;
