const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define(
    'Cliente',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        documento: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        },

        telefono: {
            type: DataTypes.STRING(30),
            allowNull: true
        },

        correo: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        direccion: {
            type: DataTypes.STRING(200),
            allowNull: true
        }
    },
    {
        tableName: 'clientes',
        timestamps: true
    }
);

module.exports = Cliente;