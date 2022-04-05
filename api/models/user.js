const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("../db");

class User extends Model {}

User.init(
  {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  {
    sequelize,
    timestamps: false,
  }
);

module.exports = { User };
