const db = require('../db');
const { DataTypes, Model } = require('sequelize');

class Cast_Crew extends Model {}

Cast_Crew.init(
  {
    name: DataTypes.STRING,
  },
  {
    sequelize: db,
    timestamps: false,
  }
);

module.exports = { Cast_Crew };