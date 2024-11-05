const db = require('../config/db');

const Usuario = {
  obtenerUsuario: (userId, callback) => {
    const query = 'SELECT * FROM USUARIO WHERE ID_USUARIO = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error al obtener el usuario:', err);
        return callback(err); // Retorna el error al controlador
      }
      if (results.length === 0) {
        return callback(null, null); // No se encontró el usuario
      }
      console.log('Usuario encontrado:', results[0]); // Imprime el usuario encontrado para depuración
      return callback(null, results[0]); // Retorna el usuario encontrado
    });
  },
};

module.exports = Usuario;
