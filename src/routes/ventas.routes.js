const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion.middleware');

const {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta,
    cancelarVenta
} = require('../controllers/ventas.controller');

const router = express.Router();

router.get('/', verificarToken, obtenerVentas);

router.get('/:id', verificarToken, obtenerVentaPorId);

router.post('/', verificarToken, crearVenta);

router.put('/:id/cancelar', verificarToken, cancelarVenta);

module.exports = router;