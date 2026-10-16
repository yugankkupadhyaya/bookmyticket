'use strict';

const {
    Model
} = require('sequelize');

const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {

    class User extends Model {

        static associate(models) {
            this.belongsTo(models.Role, {
                foreignKey: 'roleId',
                as: 'role'
            });
        }
    }

    User.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }

    }, {
        sequelize,
        modelName: 'User'
    });


    User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(
        user.password,
        10
    );
});

    return User; 
};