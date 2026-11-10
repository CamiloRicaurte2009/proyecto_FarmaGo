const express = require('express');
const router = express.Router();
const { register, login, me, updateMe, verificarToken } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.get('/me', verificarToken, me);
router.put('/me', verificarToken, updateMe);

module.exports = router;