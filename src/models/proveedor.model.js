const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Proveedor = sequelize.define(
    'Proveedor',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        nombre: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        nit: {
            type: DataTypes.STRING(30),
            allowNull: true,
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
        tableName: 'proveedores',
        timestamps: true
    }
);

module.exports = Proveedor;