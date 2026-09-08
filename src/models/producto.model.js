const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Producto = sequelize.define(
    'Producto',
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

        descripcion: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        precio: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },

        categoria: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        laboratorio: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        fecha_vencimiento: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        requiere_formula: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: 'productos',
        timestamps: true
    }
);

module.exports = Producto;