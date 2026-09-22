const DetalleVenta = require('../models/detalleVenta.model');
const Venta = require('../models/venta.model');
const Producto = require('../models/producto.model');

// GET /api/detalles-venta/venta/:ventaId
// Lista los productos vendidos dentro de una venta específica.
const obtenerDetallesPorVenta = async (req, res) => {
    try {
        const { ventaId } = req.params;

        const venta = await Venta.getById(ventaId);

        if (!venta) {
            return res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }

        const detalles = await DetalleVenta.getByVentaId(ventaId);

        res.status(200).json({
            success: true,
            cantidad: detalles.length,
            data: detalles
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al obtener los detalles de la venta'
        });
    }
};

// POST /api/detalles-venta

const crearDetalleVenta = async (req, res) => {
    try {
        const { venta_id, producto_id, cantidad, precio_unitario } = req.body;

        if (!venta_id || !producto_id || !cantidad || !precio_unitario) {
            return res.status(400).json({
                success: false,
                message: 'venta_id, producto_id, cantidad y precio_unitario son obligatorios'
            });
        }

        const venta = await Venta.getById(venta_id);
        if (!venta) {
            return res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }

        const producto = await Producto.getById(producto_id);
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        const subtotal = Number(precio_unitario) * Number(cantidad);

        const detalle = await DetalleVenta.create({
            venta_id,
            producto_id,
            cantidad,
            precio_unitario,
            subtotal
        });

        res.status(201).json({
            success: true,
            message: 'Detalle de venta creado correctamente (stock NO ajustado)',
            data: detalle
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al crear el detalle de venta'
        });
    }
};

module.exports = {
    obtenerDetallesPorVenta,
    crearDetalleVenta
};
