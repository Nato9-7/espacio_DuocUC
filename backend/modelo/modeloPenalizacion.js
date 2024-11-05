const db = require('../config/db');

const Penalizacion = {
  obtenerPorUsuario: (userId, callback) => {
    const query = 'SELECT * FROM PENALIZACION WHERE Usuario_Id_usuario = ?'; // Cambiar ID_USUARIO a Usuario_Id_usuario
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
    const query = 'INSERT INTO PENALIZACION (Descripcion, Usuario_Id_usuario, fecha_Penalizacion) VALUES (?, ?, ?)';
    db.query(query, [penalizacionData.Descripcion, penalizacionData.id_Usuario, penalizacionData.FechaPenalizacion], callback);
  },
  cancelar: (idPenalizacion, callback) => {
    const query = 'DELETE FROM PENALIZACION WHERE id_penalizacion = ?'; // Asegúrate que el nombre de columna esté correcto
    db.query(query, [idPenalizacion], callback);
  },
};

module.exports = Penalizacion;
