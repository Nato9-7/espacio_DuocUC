const db = require('../config/db');

const Penalizacion = {
   obtenerPorUsuario: (userId, callback) => {
    const query = 'SELECT * FROM PENALIZACION WHERE ID_USUARIO = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error al obtener penalizaciones:', err);
        return callback(err); // Retorna el error al controlador
      }
      console.log('Resultados obtenidos:', results); // Imprime los resultados para depuración
      return callback(null, results); // Retorna los resultados al controlador
    });
  },
  crear: (penalizacionData, callback) => {
    const query = 'INSERT INTO PENALIZACION (Descripcion, id_Usuario, fecha_Penalizacion) VALUES (?, ?, ?)';
    db.query(query, [penalizacionData.Descripcion, penalizacionData.id_Usuario, penalizacionData.FechaPenalizacion], callback);
  },
  cancelar: (idPenalizacion, callback) => {
    const query = 'DELETE FROM PENALIZACION WHERE Id_Penalizacion = ?';
    db.query(query, [idPenalizacion], callback);
  },
};

module.exports = Penalizacion;
