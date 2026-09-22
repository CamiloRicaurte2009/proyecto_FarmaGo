const Usuario = require('../models/users.model');

// GET /api/users
const getAll = async (req, res) => {
  try {
    const data = await Usuario.getAll();
    res.json({ ok: true, data });
  } catch (error) {
    console.error('Error en getAll usuarios:', error);
    res.status(500).json({ ok: false, msg: 'Error al obtener los usuarios' });
  }
};

// GET /api/users/:id
const getById = async (req, res) => {
  try {
    const usuario = await Usuario.getById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }
    res.json({ ok: true, data: usuario });
  } catch (error) {
    console.error('Error en getById usuario:', error);
    res.status(500).json({ ok: false, msg: 'Error al obtener el usuario' });
  }
};

// PUT /api/users/:id
const update = async (req, res) => {
  try {
    const { nombre, rol, activo } = req.body;
    const affectedRows = await Usuario.update(req.params.id, { nombre, rol, activo });

    if (affectedRows === 0) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }

    const usuario = await Usuario.getById(req.params.id);
    res.json({ ok: true, data: usuario });
  } catch (error) {
    console.error('Error en update usuario:', error);
    res.status(500).json({ ok: false, msg: 'Error al actualizar el usuario' });
  }
};

// DELETE /api/users/:id
const remove = async (req, res) => {
  try {
    const affectedRows = await Usuario.remove(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
    }
    res.json({ ok: true, msg: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error en remove usuario:', error);
    res.status(500).json({ ok: false, msg: 'Error al eliminar el usuario' });
  }
};

module.exports = { getAll, getById, update, remove };
