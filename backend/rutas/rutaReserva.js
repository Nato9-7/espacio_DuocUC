const express = require('express');
const router = express.Router();
const reservaController = require('../controlador/controladorReserva');

router.get('/:usuario', reservaController.obtenerReservas);
router.post('/', reservaController.crearReserva);
router.put('/:id', reservaController.cancelarReserva);
router.put('/confirmar/:id', reservaController.confirmarReserva);

module.exports = router;
