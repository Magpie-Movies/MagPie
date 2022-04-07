const db = require('../db');
const { DataTypes, Model } = require('sequelize');

class Keyword extends Model {}

Keyword.init(
  {
    keyword_name: DataTypes.STRING
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = { Keyword };
