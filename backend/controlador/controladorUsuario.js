const Usuario = require('../modelo/modeloUsuario');

const obtenerUsuario = (req, res) => {
  const userId = req.params.userId; // Corregido a req.params.userId
  Usuario.obtenerUsuario(userId, (err, usuario) => {
    if (err) {
      return res.status(500).send('Error en el servidor');
    }
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.status(200).json(usuario);
  });
};

module.exports = {
  obtenerUsuario,
};
