const express = require('express');
const { verificarToken } = require('../middlewares/auth.middleware');

const {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../controllers/productos.controller');

const router = express.Router();

// PÚBLICAS (sin token)
router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);

// PRIVADAS (con token)
router.post('/', verificarToken, crearProducto);
router.put('/:id', verificarToken, actualizarProducto);
router.delete('/:id', verificarToken, eliminarProducto);

module.exports = router;