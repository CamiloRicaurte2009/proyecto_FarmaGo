const express = require('express');

const app = express();

app.use(express.json());

const productosRoutes = require('./routes/productos.routes');

app.use('/api/productos', productosRoutes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API FarmaGo funcionando'
    });
});

module.exports = app;