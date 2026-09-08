const { sequelize } = require('../config/database');

const Venta = require('../models/venta.model');
const DetalleVenta = require('../models/detalleVenta.model');
const Producto = require('../models/producto.model');
const Cliente = require('../models/cliente.model');

const obtenerVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: [
                {
                    model: Cliente,
                    attributes: ['id', 'nombre', 'documento'],
                    required: false
                }
            ],
            order: [['id', 'DESC']]
        });

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
        const venta = await Venta.findByPk(req.params.id, {
            include: [
                {
                    model: Cliente,
                    attributes: ['id', 'nombre', 'documento'],
                    required: false
                },
                {
                    model: DetalleVenta,
                    include: [
                        {
                            model: Producto,
                            attributes: [
                                'id',
                                'nombre',
                                'precio'
                            ]
                        }
                    ]
                }
            ]
        });

        if (!venta) {
            return res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: venta
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
    const transaction = await sequelize.transaction();

    try {
        const {
            cliente_id,
            metodo_pago,
            productos
        } = req.body;

        if (!productos || !Array.isArray(productos) || productos.length === 0) {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: 'Debe incluir al menos un producto'
            });
        }

        if (cliente_id) {
            const cliente = await Cliente.findByPk(cliente_id);

            if (!cliente) {
                await transaction.rollback();

                return res.status(404).json({
                    success: false,
                    message: 'Cliente no encontrado'
                });
            }
        }

        let total = 0;

        const detalles = [];

        for (const item of productos) {
            const producto = await Producto.findByPk(
                item.producto_id,
                { transaction }
            );

            if (!producto) {
                await transaction.rollback();

                return res.status(404).json({
                    success: false,
                    message: `Producto ${item.producto_id} no encontrado`
                });
            }

            const cantidad = Number(item.cantidad);

            if (!cantidad || cantidad <= 0) {
                await transaction.rollback();

                return res.status(400).json({
                    success: false,
                    message: 'La cantidad debe ser mayor que cero'
                });
            }

            if (producto.stock < cantidad) {
                await transaction.rollback();

                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente para ${producto.nombre}`
                });
            }

            const precio = Number(producto.precio);

            const subtotal = precio * cantidad;

            total += subtotal;

            detalles.push({
                producto,
                cantidad,
                precio,
                subtotal
            });
        }

        const venta = await Venta.create(
            {
                cliente_id: cliente_id || null,
                total,
                metodo_pago: metodo_pago || 'efectivo',
                estado: 'completada'
            },
            { transaction }
        );

        for (const detalle of detalles) {
            await DetalleVenta.create(
                {
                    venta_id: venta.id,
                    producto_id: detalle.producto.id,
                    cantidad: detalle.cantidad,
                    precio_unitario: detalle.precio,
                    subtotal: detalle.subtotal
                },
                { transaction }
            );

            detalle.producto.stock -= detalle.cantidad;

            await detalle.producto.save({ transaction });
        }

        await transaction.commit();

        res.status(201).json({
            success: true,
            message: 'Venta registrada correctamente',
            data: {
                venta_id: venta.id,
                total: total
            }
        });

    } catch (error) {
        await transaction.rollback();

        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al registrar la venta'
        });
    }
};

const cancelarVenta = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const venta = await Venta.findByPk(req.params.id, {
            include: [
                {
                    model: DetalleVenta
                }
            ],
            transaction
        });

        if (!venta) {
            await transaction.rollback();

            return res.status(404).json({
                success: false,
                message: 'Venta no encontrada'
            });
        }

        if (venta.estado === 'cancelada') {
            await transaction.rollback();

            return res.status(400).json({
                success: false,
                message: 'La venta ya está cancelada'
            });
        }

        for (const detalle of venta.DetalleVenta) {
            const producto = await Producto.findByPk(
                detalle.producto_id,
                { transaction }
            );

            if (producto) {
                producto.stock += detalle.cantidad;

                await producto.save({ transaction });
            }
        }

        venta.estado = 'cancelada';

        await venta.save({ transaction });

        await transaction.commit();

        res.status(200).json({
            success: true,
            message: 'Venta cancelada correctamente'
        });

    } catch (error) {
        await transaction.rollback();

        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al cancelar la venta'
        });
    }
};

module.exports = {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta,
    cancelarVenta
};