'use strict';

const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Airport extends Model {

        static associate(models) {
            this.belongsTo(models.City, {
                foreignKey: 'cityId'
            });
        }

    }

    Airport.init({

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        code: {
            type: DataTypes.STRING,
            allowNull: false
        },

        address: {
            type: DataTypes.STRING
        },

        cityId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    }, {
        sequelize,
        modelName: 'Airport'
    });

    return Airport;
};