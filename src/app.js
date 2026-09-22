const express = require('express');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
const productosRouter = require('./routes/productos.routes');
const authRouter = require('./routes/auth.routes');
const usersRouter = require('./routes/users.routes');
const productosRoutes = require('./routes/productos.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const clientesRoutes = require('./routes/clientes.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const ventasRoutes = require('./routes/ventas.routes');
const detalleVentaRoutes = require('./routes/detalleVenta.routes');

app.use('/api/productos', productosRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
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