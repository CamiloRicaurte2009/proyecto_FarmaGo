const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion.middleware');

const {
    obtenerDetallesPorVenta,
    crearDetalleVenta
} = require('../controllers/detalleVenta.controller');

const router = express.Router();

router.get('/venta/:ventaId', verificarToken, obtenerDetallesPorVenta);

router.post('/', verificarToken, crearDetalleVenta);

module.exports = router;
