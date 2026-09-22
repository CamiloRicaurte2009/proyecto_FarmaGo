const pool = require('../config/database');

// ? = placeholder seguro (evita SQL Injection)

const getAll = async () => {
  const [rows] = await pool.query(
    `SELECT v.*, c.nombre AS cliente_nombre, c.documento AS cliente_documento
     FROM ventas v
     LEFT JOIN clientes c ON c.id = v.cliente_id
     ORDER BY v.id DESC`
  );
  return rows;
};

const getById = async (id, conn = pool) => {
  const [rows] = await conn.query(
    `SELECT v.*, c.nombre AS cliente_nombre, c.documento AS cliente_documento
     FROM ventas v
     LEFT JOIN clientes c ON c.id = v.cliente_id
     WHERE v.id = ?`,
    [id]
  );
  return rows[0]; // undefined si no existe
};

// Bloquea la fila (FOR UPDATE) para usarse dentro de una transacción,
// por ejemplo al cancelar una venta.
const getByIdForUpdate = async (id, conn) => {
  const [rows] = await conn.query(
    'SELECT * FROM ventas WHERE id = ? FOR UPDATE', [id]
  );
  return rows[0];
};

const create = async ({ cliente_id, total, metodo_pago, estado }, conn = pool) => {
  const [result] = await conn.query(
    `INSERT INTO ventas (cliente_id, total, metodo_pago, estado)
     VALUES (?, ?, ?, ?)`,
    [cliente_id ?? null, total, metodo_pago ?? 'efectivo', estado ?? 'completada']
  );
  return result.insertId;
};

const updateEstado = async (id, estado, conn = pool) => {
  const [result] = await conn.query(
    'UPDATE ventas SET estado = ? WHERE id = ?', [estado, id]
  );
  return result.affectedRows;
};

module.exports = { getAll, getById, getByIdForUpdate, create, updateEstado };
