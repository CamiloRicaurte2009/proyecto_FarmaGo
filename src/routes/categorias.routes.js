const express = require('express');
const { verificarToken } = require('../middlewares/autenticacion.middleware');

const {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
} = require('../controllers/categorias.controller');

const router = express.Router();

// publicas
router.get('/', obtenerCategorias);

router.get('/:id', obtenerCategoriaPorId);

// privadas

router.post('/', verificarToken, crearCategoria);

router.put('/:id', verificarToken, actualizarCategoria);

router.delete('/:id', verificarToken, eliminarCategoria);

module.exports = router;