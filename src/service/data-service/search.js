'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findArticle(query) {
    const resultByCategories = this.findByCategory(query);
    const resultByFullText = this.findByFullText(query);
    const resultByTitle = this.findByTitle(query);
    const resultByAnnounce = this.findByAnnounce(query);

    return resultByCategories || resultByFullText || resultByTitle || resultByAnnounce;
  }

  findByCategory(query) {
    const article = this._articles.find((article) => article.category.find((category) => category.includes(query)));
    if (!article) {
      return null;
    }
    return article;
  }

  findByFullText(query) {
    const article = this._articles.find((article) => article.fullText.includes(query));
    if (!article) {
      return null;
    }
    return article;
  }

  findByAnnounce(query) {
    const article = this._articles.find((article) => article.announce.includes(query));
    if (!article) {
      return null;
    }
    return article;
  }

  findByTitle(query) {
    const article = this._articles.find((article) => article.title.includes(query));
    if (!article) {
      return null;
    }
    return article;
  }
}

module.exports = SearchService;
