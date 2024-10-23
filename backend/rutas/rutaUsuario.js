const express = require('express');
const router = express.Router();
const usuarioController = require('../controlador/controladorUsuario');

// Aquí tus rutas para los usuarios
// Ejemplo:
router.get('/', usuarioController.obtenerUsuarios);

module.exports = router;  // Exporta el router correctamente
