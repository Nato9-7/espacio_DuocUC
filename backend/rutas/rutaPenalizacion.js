const express = require('express');
const router = express.Router();
const penalizacionController = require('../controlador/controladorPenalizacion');

router.get('/:usuario', penalizacionController.obtenerPenalizaciones);
router.post('/', penalizacionController.crearPenalizacion);
router.delete('/:id', penalizacionController.cancelarPenalizacion);

module.exports = router;
