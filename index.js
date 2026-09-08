require('dotenv').config();

const app = require('./src/app');

const {
    sequelize,
    conectarDB
} = require('./src/config/database');

const Producto = require('./src/models/producto.model');
const Categoria = require('./src/models/categoria.model');
const Cliente = require('./src/models/cliente.model');
const Proveedor = require('./src/models/proveedor.model');
const Venta = require('./src/models/venta.model');
const DetalleVenta = require('./src/models/detalleVenta.model');

const PORT = process.env.PORT || 3000;

// ==========================================
// RELACIONES
// ==========================================

// Categoría - Productos
Categoria.hasMany(Producto, {
    foreignKey: 'categoria_id'
});

Producto.belongsTo(Categoria, {
    foreignKey: 'categoria_id'
});

// Proveedor - Productos
Proveedor.hasMany(Producto, {
    foreignKey: 'proveedor_id'
});

Producto.belongsTo(Proveedor, {
    foreignKey: 'proveedor_id'
});

// Cliente - Ventas
Cliente.hasMany(Venta, {
    foreignKey: 'cliente_id'
});

Venta.belongsTo(Cliente, {
    foreignKey: 'cliente_id'
});

// Venta - Detalles
Venta.hasMany(DetalleVenta, {
    foreignKey: 'venta_id'
});

DetalleVenta.belongsTo(Venta, {
    foreignKey: 'venta_id'
});

// Producto - Detalles
Producto.hasMany(DetalleVenta, {
    foreignKey: 'producto_id'
});

DetalleVenta.belongsTo(Producto, {
    foreignKey: 'producto_id'
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================

const iniciarServidor = async () => {
    try {
        await conectarDB();

        await sequelize.sync({
            alter: true
        });

        console.log('✅ Tablas sincronizadas correctamente.');

        app.listen(PORT, () => {
            console.log(
                `🚀 Servidor ejecutándose en http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error(
            '❌ Error al iniciar el servidor:',
            error.message
        );

        process.exit(1);
    }
};

iniciarServidor();