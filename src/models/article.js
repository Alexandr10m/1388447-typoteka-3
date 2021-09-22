'use strict';

const {Model, DataTypes} = require(`sequelize`);

const define = (sequelize) => {
  class Article extends Model {}

  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    announce: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullText: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    picture: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: `Article`,
    tableName: `articles`
  });

  return Article;
};


module.exports = define;
