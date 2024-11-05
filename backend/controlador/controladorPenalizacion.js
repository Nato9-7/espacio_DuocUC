const Penalizacion = require('../modelo/modeloPenalizacion');

const obtenerPenalizaciones = (req, res) => {
  const userId = req.params.usuario;
  Penalizacion.obtenerPorUsuario(userId, (err, result) => {
    if (err) return res.status(500).send({ error: 'Error en el servidor' });
    if (result.length > 0) return res.status(200).json(result);
    return res.status(404).send({ message: 'No existen Penalizaciones' });
  });
};

const crearPenalizacion = (req, res) => {
  const PenalizacionData = req.body;

  console.log('Datos de penalización recibidos:', PenalizacionData);

  Penalizacion.crear(PenalizacionData, (err, result) => {
    if (err) {
      console.error('Error al crear la penalización:', err);
      return res.status(500).send({ error: 'Error al crear la Penalizacion' });
    }
    return res.status(200).send({ message: 'Penalizacion creada exitosamente' });
  });
};

const cancelarPenalizacion = (req, res) => {
  const idPenalizacion = req.params.id;
  Penalizacion.cancelar(idPenalizacion, (err, result) => {
    if (err) return res.status(500).send({ error: 'Error al cancelar la Penalizacion' });
    return res.status(200).send({ message: 'Penalizacion cancelada' });
  });
};

module.exports = {
  obtenerPenalizaciones,
  crearPenalizacion,
  cancelarPenalizacion
};
