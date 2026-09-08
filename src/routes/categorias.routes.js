const express = require('express');

const {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} = require('../controllers/categorias.controller');

const router = express.Router();

router.get('/', obtenerCategorias);

router.get('/:id', obtenerCategoriaPorId);

router.post('/', crearCategoria);

router.put('/:id', actualizarCategoria);

router.delete('/:id', eliminarCategoria);

module.exports = router;