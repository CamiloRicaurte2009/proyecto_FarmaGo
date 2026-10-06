const express = require('express');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const clientesRoutes = require('./routes/clientes.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const ventasRoutes = require('./routes/ventas.routes');
const detalleVentaRoutes = require('./routes/detalleVenta.routes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/detalles-venta', detalleVentaRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API FarmaGo funcionando',
        version: '1.0.0'
    });
});

module.exports = app;
