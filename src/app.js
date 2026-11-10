const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config();

const app = express();

// Middlewares
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
const usuariosRoutes = require('./routes/usuarios.routes');
const ventasRoutes = require('./routes/ventas.routes');
const detalleVentaRoutes = require('./routes/detalleVenta.routes');

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/detalleVenta', detalleVentaRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API FarmaGo funcionando',
    version: '1.0.0'
  });
});

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Error interno del servidor'
  });
});

module.exports = app;