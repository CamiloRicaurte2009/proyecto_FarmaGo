const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/users.controller');
const verificarToken = require('../middlewares/auth.middleware');

// Todas las rutas de abajo exigen un token válido
router.use(verificarToken);

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;