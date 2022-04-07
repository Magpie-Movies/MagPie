const db = require('../db');
const { DataTypes, Model } = require('sequelize');

class Category extends Model {}

Category.init(
  {
    category_name: DataTypes.STRING,
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = { Category };
