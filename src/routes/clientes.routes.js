const express = require('express');

const { verificarToken } = require('../middlewares/autenticacion.middleware');

const {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
} = require('../controllers/clientes.controller');

const router = express.Router();

router.get('/',verificarToken, obtenerClientes);

router.get('/:id', verificarToken, obtenerClientePorId);

router.post('/', verificarToken,    crearCliente);

router.put('/:id', verificarToken, actualizarCliente);

router.delete('/:id', verificarToken, eliminarCliente);

module.exports = router;