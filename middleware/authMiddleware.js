const jwt = require('jsonwebtoken');
const moment = require('moment');
const conn = require('../configuraciondb');

const JWT_SECRET = process.env.JWT_SECRET;

// Validar si se cargó el secreto
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en el archivo .env');
}

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Extraer el token del encabezado Authorization
    const token = authHeader && authHeader.split(' ')[1];

    console.log('\n🔐 Token recibido en middleware (Authorization):', authHeader);
    console.log('➡️ Token extraído:', token);

    if (!token) {
        console.warn('⛔ Token no proporcionado');
        return res.status(401).send('Token no proporcionado');
    }

    // Verificar que el token sea válido
    jwt.verify(token, JWT_SECRET, async (err, user) => {
        if (err) {
            console.warn('⛔ Token no válido:', err.message);
            return res.status(403).send('Token no válido');
        }

        let connection;

        try {
            connection = await conn.getConnection();

            // Consultar si el token existe en la tabla ActiveTokens
            const [rows] = await connection.execute(
                'SELECT LastActivity FROM ActiveTokens WHERE Token = ?',
                [token]
            );

            if (rows.length === 0) {
                console.warn('⛔ Token no encontrado en la base de datos');
                return res.status(403).send('Token no encontrado');
            }

            const lastActivity = moment(rows[0].LastActivity);
            const now = moment();
            const inactivityDuration = now.diff(lastActivity, 'minutes');

            console.log(`⏳ Última actividad: ${lastActivity.format('HH:mm:ss')}, ahora: ${now.format('HH:mm:ss')}`);
            console.log(`📉 Minutos de inactividad: ${inactivityDuration}`);

            // Si la inactividad supera el límite, cerrar sesión automáticamente
            if (inactivityDuration > 60) {
                await connection.execute(
                    'DELETE FROM ActiveTokens WHERE Token = ?',
                    [token]
                );

                const formattedDate = now.format('YYYY-MM-DD HH:mm:ss');
                await connection.execute(
                    'INSERT INTO LogsSesion (UserId, EventType, EventTimestamp, LogoutType) VALUES (?, ?, ?, ?)',
                    [user.Id, 'LOGOUT', formattedDate, 'AUTOMATIC']
                );

                console.log('🚫 Token eliminado por inactividad');
                return res.status(403).send('Sesión expirada por inactividad.');
            }

            // Actualizar la última actividad del token
            await connection.execute(
                'UPDATE ActiveTokens SET LastActivity = NOW() WHERE Token = ?',
                [token]
            );

            req.user = user; // Agregar info del usuario al request
            console.log('✅ Token verificado y actividad actualizada');
            next(); // Continuar
        } catch (error) {
            console.error('❌ Error al verificar el token:', error.message);
            res.status(500).send('Error al verificar el token: ' + error.message);
        } finally {
            if (connection) connection.release();
        }
    });
};

module.exports = verifyToken;
