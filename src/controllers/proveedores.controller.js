const Proveedor = require('../models/proveedor.model');

const obtenerProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.findAll({
            order: [['id', 'ASC']]
        });

        res.status(200).json({
            success: true,
            cantidad: proveedores.length,
            data: proveedores
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al obtener los proveedores'
        });
    }
};

const obtenerProveedorPorId = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByPk(req.params.id);

        if (!proveedor) {
            return res.status(404).json({
                success: false,
                message: 'Proveedor no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: proveedor
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el proveedor'
        });
    }
};

const crearProveedor = async (req, res) => {
    try {
        const {
            nombre,
            nit,
            telefono,
            correo,
            direccion
        } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre es obligatorio'
            });
        }

        const proveedor = await Proveedor.create({
            nombre,
            nit,
            telefono,
            correo,
            direccion
        });

        res.status(201).json({
            success: true,
            message: 'Proveedor creado correctamente',
            data: proveedor
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al crear el proveedor'
        });
    }
};

const actualizarProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByPk(req.params.id);

        if (!proveedor) {
            return res.status(404).json({
                success: false,
                message: 'Proveedor no encontrado'
            });
        }

        await proveedor.update(req.body);

        res.status(200).json({
            success: true,
            message: 'Proveedor actualizado correctamente',
            data: proveedor
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el proveedor'
        });
    }
};

const eliminarProveedor = async (req, res) => {
    try {
        const proveedor = await Proveedor.findByPk(req.params.id);

        if (!proveedor) {
            return res.status(404).json({
                success: false,
                message: 'Proveedor no encontrado'
            });
        }

        await proveedor.destroy();

        res.status(200).json({
            success: true,
            message: 'Proveedor eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el proveedor'
        });
    }
};

module.exports = {
    obtenerProveedores,
    obtenerProveedorPorId,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor
};