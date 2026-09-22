const pool = require('../config/database');

const Venta = require('../models/venta.model');
const DetalleVenta = require('../models/detalleVenta.model');
const Producto = require('../models/producto.model');
const Cliente = require('../models/cliente.model');

const obtenerVentas = async (req, res) => {
    try {
        const ventas = await Venta.getAll();

        res.status(200).json({
            success: true,
            cantidad: ventas.length,
            data: ventas
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al obtener las ventas'
        });
    }
};

const obtenerVentaPorId = async (req, res) => {
    try {
        const venta = await Venta.getById(req.params.id);

        if (!venta) {
            return res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }

        const detalles = await DetalleVenta.getByVentaId(venta.id);

        res.status(200).json({
            success: true,
            data: { ...venta, detalles }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al obtener la venta'
        });
    }
};

const crearVenta = async (req, res) => {
    // Transacción manual: usamos una sola conexión del pool para
    // garantizar que venta + detalles + stock se confirmen o se
    // reviertan todos juntos.
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const { cliente_id, metodo_pago, productos } = req.body;

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            await conn.rollback();

            return res.status(400).json({
                success: false,
                message: 'Debe incluir al menos un producto'
            });
        }

        if (cliente_id) {
            const cliente = await Cliente.getById(cliente_id);

            if (!cliente) {
                await conn.rollback();

                return res.status(404).json({
                    success: false,
                    message: 'Cliente no encontrado'
                });
            }
        }

        let total = 0;
        const detalles = [];

        for (const item of productos) {
            // FOR UPDATE bloquea la fila del producto hasta el commit/rollback,
            // evitando que dos ventas simultáneas vendan el mismo stock.
            const [rows] = await conn.query(
                'SELECT * FROM productos WHERE id = ? FOR UPDATE',
                [item.producto_id]
            );
            const producto = rows[0];

            if (!producto) {
                await conn.rollback();

                return res.status(404).json({
                    success: false,
                    message: `Producto ${item.producto_id} no encontrado`
                });
            }

            const cantidad = Number(item.cantidad);

            if (!cantidad || cantidad <= 0) {
                await conn.rollback();

                return res.status(400).json({
                    success: false,
                    message: 'La cantidad debe ser mayor que cero'
                });
            }

            if (producto.stock < cantidad) {
                await conn.rollback();

                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente para ${producto.nombre}`
                });
            }

            const precio = Number(producto.precio);
            const subtotal = precio * cantidad;

            total += subtotal;

            detalles.push({ producto, cantidad, precio, subtotal });
        }

        const ventaId = await Venta.create(
            {
                cliente_id: cliente_id || null,
                total,
                metodo_pago: metodo_pago || 'efectivo',
                estado: 'completada'
            },
            conn
        );

        for (const detalle of detalles) {
            await DetalleVenta.create(
                {
                    venta_id: ventaId,
                    producto_id: detalle.producto.id,
                    cantidad: detalle.cantidad,
                    precio_unitario: detalle.precio,
                    subtotal: detalle.subtotal
                },
                conn
            );

            await Producto.ajustarStock(detalle.producto.id, -detalle.cantidad, conn);
        }

        await conn.commit();

        res.status(201).json({
            success: true,
            message: 'Venta registrada correctamente',
            data: {
                venta_id: ventaId,
                total
            }
        });

    } catch (error) {
        await conn.rollback();

        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al registrar la venta'
        });
    } finally {
        conn.release();
    }
};

const cancelarVenta = async (req, res) => {
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const venta = await Venta.getByIdForUpdate(req.params.id, conn);

        if (!venta) {
            await conn.rollback();

            return res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }

        if (venta.estado === 'cancelada') {
            await conn.rollback();

            return res.status(400).json({
                success: false,
                message: 'La venta ya está cancelada'
            });
        }

        const detalles = await DetalleVenta.getByVentaId(venta.id, conn);

        for (const detalle of detalles) {
            await Producto.ajustarStock(detalle.producto_id, detalle.cantidad, conn);
        }

        await Venta.updateEstado(venta.id, 'cancelada', conn);

        await conn.commit();

        res.status(200).json({
            success: true,
            message: 'Venta cancelada correctamente'
        });

    } catch (error) {
        await conn.rollback();

        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al cancelar la venta'
        });
    } finally {
        conn.release();
    }
};

module.exports = {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta,
    cancelarVenta
};