const pool = require('../config/database');

// ? = placeholder seguro (evita SQL Injection)

const getByVentaId = async (ventaId, conn = pool) => {
  const [rows] = await conn.query(
    `SELECT dv.*, p.nombre AS producto_nombre, p.precio AS producto_precio_actual
     FROM detalles_venta dv
     JOIN productos p ON p.id = dv.producto_id
     WHERE dv.venta_id = ?`,
    [ventaId]
  );
  return rows;
};

const create = async ({ venta_id, producto_id, cantidad, precio_unitario, subtotal }, conn = pool) => {
  const [result] = await conn.query(
    `INSERT INTO detalles_venta (venta_id, producto_id, cantidad, precio_unitario, subtotal)
     VALUES (?, ?, ?, ?, ?)`,
    [venta_id, producto_id, cantidad, precio_unitario, subtotal]
  );
  return { id: result.insertId, venta_id, producto_id, cantidad, precio_unitario, subtotal };
};

module.exports = { getByVentaId, create };
