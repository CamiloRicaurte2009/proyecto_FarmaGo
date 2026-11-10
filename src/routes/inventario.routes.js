const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion.middleware');

const {
    obtenerInventario,
    productosBajoStock,
    entradaInventario,
    salidaInventario
} = require('../controllers/inventario.controller');

const router = express.Router();

router.get('/', verificarToken,obtenerInventario);

router.get('/bajo-stock', verificarToken,productosBajoStock);

router.post('/entrada', verificarToken,entradaInventario);

router.post('/salida', salidaInventario);

module.exports = router;