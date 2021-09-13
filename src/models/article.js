'use strict';

const {Model, DataTypes} = require(`sequelize`);


class Article extends Model {
}

const define = (sequelize) => Article.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false
    //  ! какие еще часто используемые поля и типы
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
  //  ! какие еще часто используемые поля и типы
  modelName: `Article`,
  tableName: `articles`
});


module.exports = define;
