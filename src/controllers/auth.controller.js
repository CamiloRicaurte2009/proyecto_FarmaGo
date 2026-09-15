const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/users.model');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_de_practica';

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, msg: 'nombre, email y password son requeridos' });
    }

    const existe = await Usuario.getByEmail(email);
    if (existe) {
      return res.status(409).json({ ok: false, msg: 'El email ya está registrado' });
    }

    const hash = await bcrypt.hash(password, 10);

    // create() ya devuelve el usuario sin el hash del password
    const nuevoUsuario = await Usuario.create({ nombre, email, password: hash, rol: 'empleado' });

    res.status(201).json({ ok: true, data: nuevoUsuario });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ ok: false, msg: 'Error al registrar el usuario' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, msg: 'email y password son requeridos' });
    }

    const usuario = await Usuario.getByEmail(email);
    if (!usuario) {
      return res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ ok: true, token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ ok: false, msg: 'Error al iniciar sesión' });
  }
};

module.exports = { register, login };
