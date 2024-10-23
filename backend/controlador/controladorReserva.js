const Reserva = require('../modelo/modeloReserva');

const obtenerReservas = (req, res) => {
  const userId = req.params.usuario;
  Reserva.obtenerPorUsuario(userId, (err, result) => {
    if (err) return res.status(500).send({ error: 'Error en el servidor' });
    if (result.length > 0) return res.status(200).json(result);
    return res.status(404).send({ message: 'No existen reservas' });
  });
};

const crearReserva = (req, res) => {
  const reservaData = req.body;
  Reserva.crear(reservaData, (err, result) => {
    if (err) return res.status(500).send({ error: 'Error al crear la reserva' });
    return res.status(200).send({ message: 'Reserva creada exitosamente' });
  });
};

const cancelarReserva = (req, res) => {
  const idReserva = req.params.id;
  Reserva.cancelar(idReserva, (err, result) => {
    if (err) return res.status(500).send({ error: 'Error al cancelar la reserva' });
    return res.status(200).send({ message: 'Reserva cancelada' });
  });
};

const confirmarReserva = (req, res) => {
  const idReserva = req.params.id;
  Reserva.confirmar(idReserva, (err, result) => {
    if (err) return res.status(500).send({ error: 'Error al confirmar la reserva' });
    return res.status(200).send({ message: 'Reserva confirmada' });
  });
};

module.exports = {
  obtenerReservas,
  crearReserva,
  cancelarReserva,
  confirmarReserva
};
