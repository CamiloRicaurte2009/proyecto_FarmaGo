const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion.middleware');

const {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
} = require('../controllers/proveedores.controller');

const router = express.Router();

router.get('/', verificarToken, obtenerProveedores);

router.get('/:id', verificarToken, obtenerProveedorPorId);

router.post('/', verificarToken, crearProveedor);

router.put('/:id', verificarToken, actualizarProveedor);

router.delete('/:id', verificarToken, eliminarProveedor);

module.exports = router;