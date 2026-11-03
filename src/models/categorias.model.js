const pool = require('../config/database');

// ? = placeholder seguro (evita SQL Injection)

const getAll = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM categorias ORDER BY id ASC'
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM categorias WHERE id = ?', [id]
  );
  return rows[0]; // undefined si no existe
};

const create = async ({ nombre, descripcion }) => {
  const [result] = await pool.query(
    'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
    [nombre, descripcion ?? null]
  );
  return getById(result.insertId);
};

const update = async (id, { nombre, descripcion }) => {
  const [result] = await pool.query(
    `UPDATE categorias
     SET nombre = COALESCE(?, nombre),
         descripcion = COALESCE(?, descripcion)
     WHERE id = ?`,
    [nombre, descripcion, id]
  );
  return result.affectedRows; // 0 si no existe
};

const remove = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM categorias WHERE id = ?', [id]
  );
  return result.affectedRows; // 0 si no existía
};

module.exports = { getAll, getById, create, update, remove };
