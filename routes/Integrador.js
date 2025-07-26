const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { obtenerProblemasNoGestionados, obtenerConteoEventosPorHora } = require('../controllers/Integrador'); 


// Ruta para obtener problemas no gestionados
router.get('/no-gestionados', obtenerProblemasNoGestionados);
// Ruta para obtener el conteo de eventos por hora
router.get('/conteo-por-hora', obtenerConteoEventosPorHora);

module.exports = router;