const crypto = require('crypto');
const pool = require('../config/database');

const SECRET = process.env.JWT_SECRET || 'farmago_clave_secreta';

// ---------- contraseñas (cifrado) ----------
const hashPassword = (pw) => {
  const salt = crypto.randomBytes(16).toString('hex');
  return `scrypt$${salt}$${crypto.scryptSync(pw, salt, 64).toString('hex')}`;
};
const verificarPassword = (pw, guardado) => {
  if (!guardado) return false;
  if (!guardado.startsWith('scrypt$')) return pw === guardado; // usuarios viejos
  const [, salt, hash] = guardado.split('$');
  const a = crypto.scryptSync(pw, salt, 64);
  const b = Buffer.from(hash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

// ---------- token ----------
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const firmar = (d) => crypto.createHmac('sha256', SECRET).update(d).digest('base64url');
const crearToken = (payload) => {
  const h = b64({ alg: 'HS256', typ: 'JWT' });
  const c = b64({ ...payload, exp: Math.floor(Date.now() / 1000) + 8 * 3600 });
  return `${h}.${c}.${firmar(`${h}.${c}`)}`;
};
const leerToken = (token) => {
  const [h, c, f] = (token || '').split('.');
  if (!h || !c || !f || firmar(`${h}.${c}`) !== f) throw new Error('Token inválido');
  const p = JSON.parse(Buffer.from(c, 'base64url').toString());
  if (p.exp < Date.now() / 1000) throw new Error('Token expirado');
  return p;
};

// ---------- middleware: protege rutas ----------
const verificarToken = (req, res, next) => {
  const h = req.headers.authorization || '';
  try {
    req.usuario = leerToken(h.startsWith('Bearer ') ? h.slice(7) : null);
    next();
  } catch {
    res.status(401).json({ ok: false, msg: 'Token inválido o expirado' });
  }
};

// ---------- POST /api/auth/register ----------
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ ok: false, msg: 'Todos los campos son requeridos' });
    }
    if (password.length < 6) {
      return res.status(400).json({ ok: false, msg: 'La contraseña debe tener mínimo 6 caracteres' });
    }
    const [existe] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existe.length) {
      return res.status(409).json({ ok: false, msg: 'El email ya está registrado' });
    }
    const [r] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashPassword(password), 'empleado']
    );
    res.status(201).json({ ok: true, msg: 'Usuario registrado correctamente',
      data: { id: r.insertId, nombre, email, rol: 'empleado' } });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ ok: false, msg: 'Error al registrar: ' + error.message });
  }
};

// ---------- POST /api/auth/login ----------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, msg: 'Email y password son requeridos' });
    }
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const u = rows[0];
    if (!u || !verificarPassword(password, u.password)) {
      return res.status(401).json({ ok: false, msg: 'Email o password incorrectos' });
    }
    if (!u.password.startsWith('scrypt$')) {
      await pool.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashPassword(password), u.id]);
    }
    const token = crearToken({ id: u.id, email: u.email, rol: u.rol });
    res.json({ ok: true, msg: 'Inicio de sesión correcto', token,
      usuario: { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ ok: false, msg: 'Error al iniciar sesión: ' + error.message });
  }
};

// ---------- GET /api/auth/me ----------
const me = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = ?', [req.usuario.id]);
    if (!rows[0]) return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    res.json({ ok: true, usuario: rows[0] });
  } catch (error) {
    console.error('Error en me:', error);
    res.status(500).json({ ok: false, msg: 'Error al obtener el perfil' });
  }
};

// ---------- PUT /api/auth/me ----------
const updateMe = async (req, res) => {
  try {
    const nombre = (req.body.nombre || '').trim();
    if (!nombre) return res.status(400).json({ ok: false, msg: 'El nombre es requerido' });
    await pool.query('UPDATE usuarios SET nombre = ? WHERE id = ?', [nombre, req.usuario.id]);
    const [rows] = await pool.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = ?', [req.usuario.id]);
    res.json({ ok: true, msg: 'Perfil actualizado', usuario: rows[0] });
  } catch (error) {
    console.error('Error en updateMe:', error);
    res.status(500).json({ ok: false, msg: 'Error al actualizar el perfil' });
  }
};

module.exports = { register, login, me, updateMe, verificarToken };