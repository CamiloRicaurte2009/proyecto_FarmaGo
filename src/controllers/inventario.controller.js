const Producto = require('../models/producto.model');

const obtenerInventario = async (req, res) => {
    try {
        const productos = await Producto.getInventario();

        res.status(200).json({
            success: true,
            cantidad: productos.length,
            data: productos
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al obtener el inventario'
        });
    }
};

const productosBajoStock = async (req, res) => {
    try {
        const productos = await Producto.getLowStock(10);

        res.status(200).json({
            success: true,
            cantidad: productos.length,
            data: productos
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al consultar productos con bajo stock'
        });
    }
};

const entradaInventario = async (req, res) => {
    try {
        const { producto_id, cantidad } = req.body;

        if (!producto_id || !cantidad) {
            return res.status(400).json({
                success: false,
                message: 'producto_id y cantidad son obligatorios'
            });
        }

        if (Number(cantidad) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad debe ser mayor que cero'
            });
        }

        const producto = await Producto.getById(producto_id);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        await Producto.ajustarStock(producto_id, Number(cantidad));
        const actualizado = await Producto.getById(producto_id);

        res.status(200).json({
            success: true,
            message: 'Entrada de inventario registrada',
            data: actualizado
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al registrar entrada de inventario'
        });
    }
};

const salidaInventario = async (req, res) => {
    try {
        const { producto_id, cantidad } = req.body;

        if (!producto_id || !cantidad) {
            return res.status(400).json({
                success: false,
                message: 'producto_id y cantidad son obligatorios'
            });
        }

        if (Number(cantidad) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad debe ser mayor que cero'
            });
        }

        const producto = await Producto.getById(producto_id);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        if (producto.stock < Number(cantidad)) {
            return res.status(400).json({
                success: false,
                message: 'No hay suficiente stock disponible'
            });
        }

        await Producto.ajustarStock(producto_id, -Number(cantidad));
        const actualizado = await Producto.getById(producto_id);

        res.status(200).json({
            success: true,
            message: 'Salida de inventario registrada',
            data: actualizado
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al registrar salida de inventario'
        });
    }
};

module.exports = {
    obtenerInventario,
    productosBajoStock,
    entradaInventario,
    salidaInventario
};
