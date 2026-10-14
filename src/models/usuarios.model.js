const pool = require('../config/database');

// ? = placeholder seguro (evita SQL Injection)

const getAll = async () => {
  const [rows] = await pool.query(
    'SELECT id, nombre, email, rol, activo, createdAt, updatedAt FROM usuarios ORDER BY id DESC'
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT id, nombre, email, rol, activo, createdAt, updatedAt FROM usuarios WHERE id = ?',
    [id]
  );
  return rows[0]; // undefined si no existe
};

// Trae el registro completo (incluye el hash del password) porque
// se usa internamente para validar el login. Nunca se envía tal cual al cliente.
const getByEmail = async (email) => {
  const [rows] = await pool.query(
    'SELECT * FROM usuarios WHERE email = ?', [email]
  );
  return rows[0];
};

const create = async ({ nombre, email, password, rol }) => {
  const [result] = await pool.query(
    'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
    [nombre, email, password, rol ?? 'empleado']
  );
  return { id: result.insertId, nombre, email, rol: rol ?? 'empleado' };
};

// UPDATE — actualizar campos (no toca el password, para eso está updatePassword)
const update = async (id, { nombre, rol, activo }) => {
  const [result] = await pool.query(
    `UPDATE usuarios
     SET nombre = COALESCE(?, nombre),
         rol    = COALESCE(?, rol),
         activo = COALESCE(?, activo)
     WHERE id = ?`,
    [nombre, rol, activo, id]
  );
  return result.affectedRows; // 0 si no existe
};

const updatePassword = async (id, passwordHash) => {
  const [result] = await pool.query(
    'UPDATE usuarios SET password = ? WHERE id = ?',
    [passwordHash, id]
  );
  return result.affectedRows;
};

// DELETE — eliminar por ID
const remove = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM usuarios WHERE id = ?', [id]
  );
  return result.affectedRows; // 0 si no existía
};

module.exports = { getAll, getById, getByEmail, create, update, updatePassword, remove };
