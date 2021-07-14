'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_LENGTH_ID} = require(`../../constants`);

class ArticleService{
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    const article = this._articles.find((article) => article.id === id);

    if (!article) {
      return null;
    }

    return article;
  }

  create(article) {
    const newArticle = Object.assign({id: nanoid(MAX_LENGTH_ID), comments: []},  article);

    this._articles.push(newArticle);

    return newArticle;
  }

  remove(id) {
    const article = this._articles.filter((article) => article.id === id);

    if (!article) {
      return null;
    }

    this._articles = this._articles.filter((article) => article.id !== id);

    return article;
  }

  upDate(id, article) {
    const oldArticle = this._articles.find((article) => article.id === id);

    return Object.assign(oldArticle, article);
  }

}

module.exports = ArticleService;
