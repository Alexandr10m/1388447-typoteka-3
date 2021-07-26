'use strict';

const axios = require(`axios`);
const {DEFAULT_PORT} = require(`../constants`);

const TIMEOUT = 1000;

const port = process.env.API_PORT || DEFAULT_PORT;
const defaultURL = `http://localhost:${port}/api`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({baseURL, timeout});
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  async getArticles() {
    return await this._load(`/articles`);
  }

  async getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  async search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories() {
    return this._load(`/categories`);
  }

  async createArticle(data) {
    return this._load(`/articles`, {method: `POST`, data});
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI,
};
