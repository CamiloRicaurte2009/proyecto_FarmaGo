const Producto = require('../models/producto.model');

// ==========================================
// GET /api/productos
// Obtener todos los productos
// ==========================================
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.getAll();

        res.status(200).json({
            success: true,
            cantidad: productos.length,
            data: productos
        });

    } catch (error) {
        console.error('Error al obtener productos:', error);

        res.status(500).json({
            success: false,
            message: 'Error al obtener los productos'
        });
    }
};


// ==========================================
// GET /api/productos/:id
// Obtener producto por ID
// ==========================================
const obtenerProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.getById(id);

        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: producto
        });

    } catch (error) {
        console.error('Error al obtener producto:', error);

        res.status(500).json({
            success: false,
            message: 'Error al obtener el producto'
        });
    }
};


// ==========================================
// POST /api/productos
// Crear producto
// ==========================================
const crearProducto = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            precio,
            stock,
            categoria,
            laboratorio,
            fecha_vencimiento,
            requiere_formula
        } = req.body;

        if (!nombre || precio === undefined) {
            return res.status(400).json({
                success: false,
                message: 'El nombre y el precio son obligatorios'
            });
        }

        if (Number(precio) < 0) {
            return res.status(400).json({
                success: false,
                message: 'El precio no puede ser negativo'
            });
        }

        const producto = await Producto.create({
            nombre,
            descripcion,
            precio,
            stock,
            categoria,
            laboratorio,
            fecha_vencimiento,
            requiere_formula
        });

        res.status(201).json({
            success: true,
            message: 'Producto creado correctamente',
            data: producto
        });

    } catch (error) {
        console.error('Error al crear producto:', error);

        res.status(500).json({
            success: false,
            message: 'Error al crear el producto'
        });
    }
};


// ==========================================
// PUT /api/productos/:id
// Actualizar producto
// ==========================================
const actualizarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const existente = await Producto.getById(id);

        if (!existente) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        const {
            nombre,
            descripcion,
            precio,
            stock,
            categoria,
            laboratorio,
            fecha_vencimiento,
            requiere_formula
        } = req.body;

        if (precio !== undefined && Number(precio) < 0) {
            return res.status(400).json({
                success: false,
                message: 'El precio no puede ser negativo'
            });
        }

        if (stock !== undefined && Number(stock) < 0) {
            return res.status(400).json({
                success: false,
                message: 'El stock no puede ser negativo'
            });
        }

        await Producto.update(id, {
            nombre,
            descripcion,
            precio,
            stock,
            categoria,
            laboratorio,
            fecha_vencimiento,
            requiere_formula
        });

        const producto = await Producto.getById(id);

        res.status(200).json({
            success: true,
            message: 'Producto actualizado correctamente',
            data: producto
        });

    } catch (error) {
        console.error('Error al actualizar producto:', error);

        res.status(500).json({
            success: false,
            message: 'Error al actualizar el producto'
        });
    }
};


// ==========================================
// DELETE /api/productos/:id
// Eliminar producto
// ==========================================
const eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const existente = await Producto.getById(id);

        if (!existente) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        await Producto.remove(id);

        res.status(200).json({
            success: true,
            message: 'Producto eliminado correctamente'
        });

    } catch (error) {
        console.error('Error al eliminar producto:', error);

        res.status(500).json({
            success: false,
            message: 'Error al eliminar el producto'
        });
    }
};


// ==========================================
// EXPORTAR FUNCIONES
// ==========================================
module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};