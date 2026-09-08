const express = require('express');

const {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta,
    cancelarVenta
} = require('../controllers/ventas.controller');

const router = express.Router();

router.get('/', obtenerVentas);

router.get('/:id', obtenerVentaPorId);

router.post('/', crearVenta);

router.put('/:id/cancelar', cancelarVenta);

module.exports = router;