const express = require('express');
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Rutas
const productosRouter = require('./routes/productos.routes');
const authRouter = require('./routes/auth.routes');
const usersRouter = require('./routes/users.routes');

app.use('/api/productos', productosRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

module.exports = app;