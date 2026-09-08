const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { usuarios, nextId } = require('../data/users');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_de_practica';

// POST /api/auth/register
const register = async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ ok: false, msg: 'nombre, email y password son requeridos' });
  }

  const existe = usuarios.find(u => u.email === email);
  if (existe) {
    return res.status(409).json({ ok: false, msg: 'El email ya está registrado' });
  }

  const hash = await bcrypt.hash(password, 10);

  const nuevoUsuario = {
    id: nextId(),
    nombre,
    email,
    password: hash,
    rol: 'empleado'
  };

  usuarios.push(nuevoUsuario);

  // Nunca devolver el hash de la contraseña en la respuesta
  const { password: _, ...usuarioSinPassword } = nuevoUsuario;
  res.status(201).json({ ok: true, data: usuarioSinPassword });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, msg: 'email y password son requeridos' });
  }

  const usuario = usuarios.find(u => u.email === email);
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
};

module.exports = { register, login };
