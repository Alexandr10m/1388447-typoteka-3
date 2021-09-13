'use strict';

const {Model, DataTypes} = require(`sequelize`);


class Category extends Model {
}

const define = (sequelize) => Category.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    //  ! какие еще часто используемые поля и типы
  }
}, {
  sequelize,
  modelName: `Category`,
  tableName: `categories`
});


module.exports = define;
