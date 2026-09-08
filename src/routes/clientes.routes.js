const express = require('express');

const {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
} = require('../controllers/clientes.controller');

const router = express.Router();

router.get('/', obtenerClientes);

router.get('/:id', obtenerClientePorId);

router.post('/', crearCliente);

router.put('/:id', actualizarCliente);

router.delete('/:id', eliminarCliente);

module.exports = router;