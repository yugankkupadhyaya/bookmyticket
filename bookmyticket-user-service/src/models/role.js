'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {

    static associate(models) {
      this.hasMany(models.User, {
        foreignKey: 'roleId',
        as: 'users'
      });
    }
  }
  Role.init({
    name: {
      type: DataTypes.ENUM(
        'ADMIN',
        'CUSTOMER',
        'FLIGHT_COMPANY'
      ),
      allowNull: false,
      unique: true
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true
    }

  }, {
    sequelize,
    modelName: 'Role',
  });

  return Role;
};