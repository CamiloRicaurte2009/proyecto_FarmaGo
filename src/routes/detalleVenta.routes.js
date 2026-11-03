const express = require('express');

const {
    obtenerDetallesPorVenta,
    crearDetalleVenta
} = require('../controllers/detalleVenta.controller');

const router = express.Router();

router.get('/venta/:ventaId', obtenerDetallesPorVenta);

router.post('/', crearDetalleVenta);

module.exports = router;
