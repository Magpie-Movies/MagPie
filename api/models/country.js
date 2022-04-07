const db = require('../db');
const { DataTypes, Model } = require('sequelize');

class Country extends Model {}

Country.init(
  {
    country_name: DataTypes.STRING,
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = { Country };
