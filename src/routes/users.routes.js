const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuarios.controller');
const { verificarToken } = require('../middlewares/autenticacion.middleware');

// Todas las rutas de abajo exigen un token válido
router.get('/',verificarToken, ctrl.getAll);
router.get('/:id',verificarToken, ctrl.getById);
router.put('/:id',verificarToken, ctrl.update);
router.delete('/:id',verificarToken, ctrl.remove);

module.exports = router;