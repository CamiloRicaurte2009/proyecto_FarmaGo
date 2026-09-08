require('dotenv').config();

const app = require('./src/app');

const { sequelize, conectarDB } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await conectarDB();

        await sequelize.sync();

        console.log('✅ Tablas sincronizadas correctamente.');

        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
};

iniciarServidor();