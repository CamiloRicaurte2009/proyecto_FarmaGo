const express = require('express');

const {
    obtenerInventario,
    productosBajoStock,
    entradaInventario,
    salidaInventario
} = require('../controllers/inventario.controller');

const router = express.Router();

router.get('/', obtenerInventario);

router.get('/bajo-stock', productosBajoStock);

router.post('/entrada', entradaInventario);

router.post('/salida', salidaInventario);

module.exports = router;