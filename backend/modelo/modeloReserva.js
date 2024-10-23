const db = require('../config/db');

const Reserva = {
  obtenerPorUsuario: (userId, callback) => {
    const query = 'SELECT * FROM RESERVA WHERE ID_USUARIO = ?';
    db.query(query, [userId], callback);
  },
  crear: (reservaData, callback) => {
    const query = 'INSERT INTO RESERVA (Fecha_reserva, estado_reserva, Id_usuario, horario_id_horario, id_sala) VALUES (?, "pendiente", ?, ?, ?)';
    db.query(query, [reservaData.fecha, reservaData.userId, reservaData.horario, reservaData.sala], callback);
  },
  cancelar: (idReserva, callback) => {
    const query = 'DELETE FROM RESERVA WHERE Id_reserva = ?';
    db.query(query, [idReserva], callback);
  },
  confirmar: (idReserva, callback) => {
    const query = 'UPDATE RESERVA SET estado_reserva = "confirmada" WHERE Id_reserva = ?';
    db.query(query, [idReserva], callback);
  }
};

module.exports = Reserva;
