'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../../models/aliase`);


class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll(needCount) {
    if(needCount) {
      const result = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          // `createdAt`
          [Sequelize.fn(`COUNT`, `CategoryId`), `count`]
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [{
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: []
        }]
      });
      return result.map((it) => it.get());
    } else {
      return this._Category.findAll({raw: true})
    }
  }

  async findOne(id) {
    return await this._Category.findAll({
      where: {id},
      include: [Aliase.ARTICLES]
    });
  }
}

module.exports = CategoryService;
