const express = require('express');
const router = express.Router();
const usuarioController = require('../controlador/controladorUsuario');

router.get('/:userId', usuarioController.obtenerUsuario);

module.exports = router;
