const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Venta = sequelize.define(
    'Venta',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        cliente_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
        },

        metodo_pago: {
            type: DataTypes.ENUM(
                'efectivo',
                'tarjeta',
                'transferencia'
            ),
            allowNull: false,
            defaultValue: 'efectivo'
        },

        estado: {
            type: DataTypes.ENUM(
                'completada',
                'cancelada'
            ),
            allowNull: false,
            defaultValue: 'completada'
        }
    },
    {
        tableName: 'ventas',
        timestamps: true
    }
);

module.exports = Venta;