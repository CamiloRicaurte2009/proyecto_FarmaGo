const express = require('express');

require('dotenv').config();
const app = express();
const cors   = require('cors');
const morgan = require('morgan');

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(morgan('dev'));
app.use(express.json());

const authRoutes = require('./routes/autenticacion.routes');
const productosRoutes = require('./routes/productos.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const clientesRoutes = require('./routes/clientes.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const ventasRoutes = require('./routes/ventas.routes');
const detalleVentaRoutes = require('./routes/detalleVenta.routes');

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/detalleVenta', detalleVentaRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API FarmaGo funcionando', version: '1.0.0' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;