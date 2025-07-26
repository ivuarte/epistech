const mysql = require('mysql2/promise');
const moment = require('moment'); // Importar la biblioteca moment
const conn = require('../configuraciondb'); // Archivo de configuración de la conexión

exports.obtenerProblemasNoGestionados = async (req, res) => {
    let connection;

    try {
        connection = await conn.getConnection();
        const [rows] = await connection.query('CALL sp_ObtenerProblemasNoGestionados()');

        // Formatear las fechas en el formato deseado usando moment
        const formattedRows = rows[0].map(row => ({
            ...row,
            fecha_creacion: row.fecha_creacion ? moment(row.fecha_creacion).format('YYYY-MM-DD HH:mm:ss') : null,
            fecha_resolucion: row.fecha_resolucion ? moment(row.fecha_resolucion).format('YYYY-MM-DD HH:mm:ss') : null
        }));

        // Enviar la respuesta con los datos formateados
        res.status(200).json(formattedRows);
    } catch (error) {
        console.error('Error al obtener problemas no gestionados:', error.message);
        res.status(500).send('Hubo un error al obtener los problemas no gestionados.');
    } finally {
        if (connection) connection.release(); // Asegúrate de liberar la conexión
    }
};

exports.obtenerConteoEventosPorHora = async (req, res) => {
    let connection;

    try {
        connection = await conn.getConnection();

        // Ejecutar el procedimiento almacenado
        const [rows] = await connection.query('CALL sp_ConteoEventosPorHora()');

        // Enviar la respuesta con los datos obtenidos
        res.status(200).json(rows[0]); // rows[0] porque el resultado del SP puede estar en la primera posición
    } catch (error) {
        console.error('Error al obtener conteo de eventos por hora:', error.message);
        res.status(500).send('Hubo un error al obtener el conteo de eventos por hora.');
    } finally {
        if (connection) connection.release(); // Asegúrate de liberar la conexión
    }
};