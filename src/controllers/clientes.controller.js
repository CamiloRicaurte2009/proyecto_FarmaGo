const Cliente = require('../models/cliente.model');

const obtenerClientes = async (req, res) => {
    try {
        const clientes = await Cliente.getAll();

        res.status(200).json({
            success: true,
            cantidad: clientes.length,
            data: clientes
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al obtener los clientes'
        });
    }
};

const obtenerClientePorId = async (req, res) => {
    try {
        const cliente = await Cliente.getById(req.params.id);

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: cliente
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el cliente'
        });
    }
};

const crearCliente = async (req, res) => {
    try {
        const { nombre, documento, telefono, correo, direccion } = req.body;

        if (!nombre || !documento) {
            return res.status(400).json({
                success: false,
                message: 'El nombre y documento son obligatorios'
            });
        }

        const cliente = await Cliente.create({ nombre, documento, telefono, correo, direccion });

        res.status(201).json({
            success: true,
            message: 'Cliente creado correctamente',
            data: cliente
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al crear el cliente'
        });
    }
};

const actualizarCliente = async (req, res) => {
    try {
        const existente = await Cliente.getById(req.params.id);

        if (!existente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

        await Cliente.update(req.params.id, req.body);
        const cliente = await Cliente.getById(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Cliente actualizado correctamente',
            data: cliente
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el cliente'
        });
    }
};

const eliminarCliente = async (req, res) => {
    try {
        const existente = await Cliente.getById(req.params.id);

        if (!existente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado'
            });
        }

        await Cliente.remove(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Cliente eliminado correctamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el cliente'
        });
    }
};

module.exports = {
    obtenerClientes,
    obtenerClientePorId,
    crearCliente,
    actualizarCliente,
    eliminarCliente
};