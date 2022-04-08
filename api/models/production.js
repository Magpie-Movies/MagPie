const db = require('../db');
const { DataTypes, Model } = require('sequelize');

class Production_Company extends Model {}

Production_Company.init(
  {
    production_name: DataTypes.STRING,
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = { Production_Company };