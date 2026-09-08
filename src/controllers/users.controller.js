const { usuarios } = require('../data/users');

const getAll = (req, res) => {
  // No exponer el hash de la contraseña en la lista
  const data = usuarios.map(({ password, ...resto }) => resto);
  res.json({ ok: true, data });
};

const getById = (req, res) => {
  const usuario = usuarios.find(u => u.id == req.params.id);
  if (!usuario) {
    return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
  }
  const { password, ...usuarioSinPassword } = usuario;
  res.json({ ok: true, data: usuarioSinPassword });
};

const update = (req, res) => {
  const usuario = usuarios.find(u => u.id == req.params.id);
  if (!usuario) {
    return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
  }
  const { nombre, rol } = req.body;
  if (nombre) usuario.nombre = nombre;
  if (rol) usuario.rol = rol;

  const { password, ...usuarioSinPassword } = usuario;
  res.json({ ok: true, data: usuarioSinPassword });
};

const remove = (req, res) => {
  const index = usuarios.findIndex(u => u.id == req.params.id);
  if (index === -1) {
    return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
  }
  usuarios.splice(index, 1);
  res.json({ ok: true, msg: 'Usuario eliminado' });
};

module.exports = { getAll, getById, update, remove };
