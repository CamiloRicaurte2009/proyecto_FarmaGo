const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DetalleVenta = sequelize.define(
    'DetalleVenta',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        venta_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        producto_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        precio_unitario: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    },
    {
        tableName: 'detalles_venta',
        timestamps: true
    }
);

module.exports = DetalleVenta;