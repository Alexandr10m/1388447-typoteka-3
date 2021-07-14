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
    const article = this._articles.find((item) => item.category.find((category) => category.includes(query)));
    if (!article) {
      return null;
    }
    return article;
  }

  findByFullText(query) {
    const article = this._articles.find((item) => item.fullText.includes(query));
    if (!article) {
      return null;
    }
    return article;
  }

  findByAnnounce(query) {
    const article = this._articles.find((item) => item.announce.includes(query));
    if (!article) {
      return null;
    }
    return article;
  }

  findByTitle(query) {
    const article = this._articles.find((item) => item.title.includes(query));
    if (!article) {
      return null;
    }
    return article;
  }
}

module.exports = SearchService;
