const pool = require('../config/database');

// ? = placeholder seguro (evita SQL Injection)

const getAll = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM productos ORDER BY id ASC'
  );
  return rows;
};

const getById = async (id, conn = pool) => {
  const [rows] = await conn.query(
    'SELECT * FROM productos WHERE id = ?', [id]
  );
  return rows[0]; // undefined si no existe
};

// Vista resumida para /api/inventario (ordenada por stock ascendente)
const getInventario = async () => {
  const [rows] = await pool.query(
    `SELECT id, nombre, precio, stock, categoria, laboratorio, fecha_vencimiento
     FROM productos
     ORDER BY stock ASC`
  );
  return rows;
};

const getLowStock = async (limite = 10) => {
  const [rows] = await pool.query(
    'SELECT * FROM productos WHERE stock <= ? ORDER BY stock ASC',
    [limite]
  );
  return rows;
};

const create = async ({
  nombre, descripcion, precio, stock,
  categoria, laboratorio, fecha_vencimiento, requiere_formula
}) => {
  const [result] = await pool.query(
    `INSERT INTO productos
       (nombre, descripcion, precio, stock, categoria, laboratorio, fecha_vencimiento, requiere_formula)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre, descripcion ?? null, precio, stock ?? 0,
      categoria ?? null, laboratorio ?? null,
      fecha_vencimiento ?? null, requiere_formula ?? false
    ]
  );
  return getById(result.insertId);
};

const update = async (id, {
  nombre, descripcion, precio, stock,
  categoria, laboratorio, fecha_vencimiento, requiere_formula
}) => {
  const [result] = await pool.query(
    `UPDATE productos
     SET nombre            = COALESCE(?, nombre),
         descripcion       = COALESCE(?, descripcion),
         precio            = COALESCE(?, precio),
         stock             = COALESCE(?, stock),
         categoria         = COALESCE(?, categoria),
         laboratorio       = COALESCE(?, laboratorio),
         fecha_vencimiento = COALESCE(?, fecha_vencimiento),
         requiere_formula  = COALESCE(?, requiere_formula)
     WHERE id = ?`,
    [
      nombre, descripcion, precio, stock,
      categoria, laboratorio, fecha_vencimiento, requiere_formula, id
    ]
  );
  return result.affectedRows; // 0 si no existe
};

const remove = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM productos WHERE id = ?', [id]
  );
  return result.affectedRows; // 0 si no existía
};

// Suma (o resta, si cantidad es negativa) al stock actual.
// Acepta una conexión de transacción (usado por ventas.controller.js).
const ajustarStock = async (id, cantidad, conn = pool) => {
  const [result] = await conn.query(
    'UPDATE productos SET stock = stock + ? WHERE id = ?',
    [cantidad, id]
  );
  return result.affectedRows;
};

module.exports = {
  getAll, getById, getInventario, getLowStock,
  create, update, remove, ajustarStock
};
