'use strict';

const {Model, DataTypes} = require(`sequelize`);


const define = (sequelize) => {
  class Category extends Model {}

  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: `Category`,
    tableName: `categories`
  });
  return Category;
};


module.exports = define;
