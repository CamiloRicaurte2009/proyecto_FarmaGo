const Usuario = require('../models/users.model');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        ok: false,
        msg: 'Todos los campos son requeridos'
      });
    }

    const existe = await Usuario.getByEmail(email);

    if (existe) {
      return res.status(409).json({
        ok: false,
        msg: 'El email ya está registrado'
      });
    }

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password,
      rol: 'empleado'
    });

    res.status(201).json({
      ok: true,
      msg: 'Usuario registrado correctamente',
      data: nuevoUsuario
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: 'Error al registrar el usuario'
    });
  }
};


// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        msg: 'Email y password son requeridos'
      });
    }

    const usuario = await Usuario.getByEmail(email);

    if (!usuario) {
      return res.status(401).json({
        ok: false,
        msg: 'Email o password incorrectos'
      });
    }

    // Comparar contraseña directamente
    if (password !== usuario.password) {
      return res.status(401).json({
        ok: false,
        msg: 'Email o password incorrectos'
      });
    }

    res.json({
      ok: true,
      msg: 'Inicio de sesión correcto',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: 'Error al iniciar sesión'
    });
  }
};


module.exports = {
  register,
  login
};