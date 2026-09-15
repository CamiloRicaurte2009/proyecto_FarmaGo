const pool = require('../config/database');

// ? = placeholder seguro (evita SQL Injection)

const getAll = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM clientes ORDER BY id ASC'
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await pool.query(
    'SELECT * FROM clientes WHERE id = ?', [id]
  );
  return rows[0]; // undefined si no existe
};

const create = async ({ nombre, documento, telefono, correo, direccion }) => {
  const [result] = await pool.query(
    `INSERT INTO clientes (nombre, documento, telefono, correo, direccion)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, documento, telefono ?? null, correo ?? null, direccion ?? null]
  );
  return getById(result.insertId);
};

const update = async (id, { nombre, documento, telefono, correo, direccion }) => {
  const [result] = await pool.query(
    `UPDATE clientes
     SET nombre    = COALESCE(?, nombre),
         documento = COALESCE(?, documento),
         telefono  = COALESCE(?, telefono),
         correo    = COALESCE(?, correo),
         direccion = COALESCE(?, direccion)
     WHERE id = ?`,
    [nombre, documento, telefono, correo, direccion, id]
  );
  return result.affectedRows; // 0 si no existe
};

const remove = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM clientes WHERE id = ?', [id]
  );
  return result.affectedRows; // 0 si no existía
};

module.exports = { getAll, getById, create, update, remove };
