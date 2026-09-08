const express = require('express');

const app = express();

app.use(express.json());

const productosRoutes = require('./routes/productos.routes');
const categoriasRoutes = require('./routes/categorias.routes');
const clientesRoutes = require('./routes/clientes.routes');
const proveedoresRoutes = require('./routes/proveedores.routes');
const inventarioRoutes = require('./routes/inventario.routes');
const ventasRoutes = require('./routes/ventas.routes');

app.use('/api/productos', productosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/ventas', ventasRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API FarmaGo funcionando',
        version: '1.0.0'
    });
});

module.exports = app;

module.exports = app;