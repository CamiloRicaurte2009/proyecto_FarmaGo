const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

// Crea el token con los datos del usuario
const generarToken = (usuario) =>
  jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, msg: 'Todos los campos son requeridos' });
    }

    const [existe] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existe.length) {
      return res.status(409).json({ ok: false, msg: 'El email ya está registrado' });
    }

    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, hash]
    );

   const token = generarToken({ id: result.insertId, email, rol: 'empleado' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al registrar el usuario' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ ok: false, msg: 'Email y password son requeridos' });
    }

    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const usuario = rows[0];

    if (!usuario) {
      return res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });
    }

    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) {
      return res.status(401).json({ ok: false, msg: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario);
    res.json({
      ok: true,
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al iniciar sesión' });
  }
};

module.exports = { register, login };