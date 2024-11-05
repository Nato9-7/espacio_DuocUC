const db = require('../config/db');

const Penalizacion = {
  obtenerPorUsuario: (userId, callback) => {
    const query = 'SELECT * FROM PENALIZACION WHERE Usuario_Id_usuario = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Error al obtener penalizaciones:', err);
        return callback(err);
      }
      console.log('Resultados obtenidos:', results);
      return callback(null, results);
    });
  },
  crear: (penalizacionData, callback) => {
    const query = 'INSERT INTO PENALIZACION (Descripcion, Usuario_Id_usuario) VALUES (?, ?)';
    db.query(query, [penalizacionData.Descripcion, penalizacionData.Usuario_Id_usuario], callback);
  },
  cancelar: (idPenalizacion, callback) => {
    const query = 'DELETE FROM PENALIZACION WHERE id_penalizacion = ?';
    db.query(query, [idPenalizacion], callback);
  },
};

module.exports = Penalizacion;
