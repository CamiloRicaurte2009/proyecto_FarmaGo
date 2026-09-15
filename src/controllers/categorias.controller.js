const Categoria = require('../models/categoria.model');

const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.getAll();

        res.status(200).json({
            success: true,
            cantidad: categorias.length,
            data: categorias
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al obtener las categorías'
        });
    }
};

const obtenerCategoriaPorId = async (req, res) => {
    try {
        const categoria = await Categoria.getById(req.params.id);

        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: categoria
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la categoría'
        });
    }
};

const crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre es obligatorio'
            });
        }

        const categoria = await Categoria.create({ nombre, descripcion });

        res.status(201).json({
            success: true,
            message: 'Categoría creada correctamente',
            data: categoria
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Error al crear la categoría'
        });
    }
};

const actualizarCategoria = async (req, res) => {
    try {
        const existente = await Categoria.getById(req.params.id);

        if (!existente) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        await Categoria.update(req.params.id, req.body);
        const categoria = await Categoria.getById(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Categoría actualizada correctamente',
            data: categoria
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la categoría'
        });
    }
};

const eliminarCategoria = async (req, res) => {
    try {
        const existente = await Categoria.getById(req.params.id);

        if (!existente) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        await Categoria.remove(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Categoría eliminada correctamente'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la categoría'
        });
    }
};

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
};
