const express = require('express');

require('dotenv').config();
const app = express();
const cors       = require('cors');
const morgan     = require('morgan');

// Middleware para parsear JSON
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/autenticacion.routes');
const productosRoutes = require('./routes/productos.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const clientesRoutes = require('./routes/clientes.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const usersRoutes = require('./routes/usuarios.routes');
const ventasRoutes = require('./routes/ventas.routes');
const detalleVentaRoutes = require('./routes/detalleVenta.routes');

// Usar rutas
app.use('/api/autenticacion', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/usuarios', usersRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/detalleVenta', detalleVentaRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API FarmaGo funcionando',
        version: '1.0.0'
    });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor en puerto ${process.env.PORT}`);
});

module.exports = app;
