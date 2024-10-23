const express = require('express');
const mysql = require('mysql');
const cors = require('cors');  
const app = express();

app.use(cors({
  origin: 'http://localhost:8100', 
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json()); 

// Configurar la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'espacios_duoc'
});

// Conectar a MySQL
db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a MySQL exitosa');
});

// Ruta para obtener los usuarios
app.get('/usuario', (req, res) => {
  let sql = 'SELECT * FROM usuario';
  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error en la consulta');
      return;
    }
    res.json(results);
  });
});


// Ruta para login
app.post('/login', (req, res) => {
  console.log('Datos recibidos:', req.body); 
  const { correo, password } = req.body;

  // Consulta a la base de datos
  const query = "SELECT * FROM usuario WHERE correo = ? AND contrasena = ?";
  db.query(query, [correo, password], (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).send({ error: 'Error en el servidor' });
    }

    if (result.length > 0) {

      const usuario = result[0];
      res.status(200).send({ message: 'Login exitoso', userId: usuario.Id_usuario });
    } else {
      console.log('Correo o contraseña incorrectos');
      res.status(401).send({ message: 'Correo o contraseña incorrectos' });
    }
  });
});


// Ruta para obtener las reservas de un usuario, con el ID del usuario en la URL
app.get('/reserva/:usuario', (req, res) => {
  const usuario = req.params.usuario; // Obtener el ID del usuario desde los params

  let sql = 'SELECT * FROM RESERVA WHERE ID_USUARIO = ?';
  db.query(sql, [usuario], (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).send({ error: 'Error en el servidor' });
    }

    if (result.length > 0) {
      console.log('Reservas encontradas:', result);
      res.status(200).json(result); // Envía las reservas como respuesta
    } else {
    }
  });
});

// Ruta para cancelar (eliminar) una reserva
app.delete('/reserva/:id', (req, res) => {
  const reservaId = req.params.id;

  const query = 'DELETE FROM RESERVA WHERE Id_reserva = ?';
  
  db.query(query, [reservaId], (err, result) => {
    if (err) {
      console.error('Error al eliminar la reserva:', err);
      return res.status(500).send({ error: 'Error al eliminar la reserva' });
    }

    if (result.affectedRows > 0) {
      console.log('Reserva eliminada exitosamente');
      res.status(200).send({ message: 'Reserva eliminada exitosamente' });
    } else {
      console.log('No se encontró la reserva');
      res.status(404).send({ message: 'Reserva no encontrada' });
    }
  });
});

// Ruta para confirmar una reserva (actualizar estado a 'confirmada')
app.put('/reserva/confirmar/:id', (req, res) => {
  const reservaId = req.params.id;  // Obtener el ID de la reserva de los params

  const query = "UPDATE RESERVA SET estado_reserva = 'confirmada' WHERE Id_reserva = ?";

  db.query(query, [reservaId], (err, result) => {
    if (err) {
      console.error('Error al actualizar la reserva:', err);
      return res.status(500).send({ error: 'Error en el servidor' });
    }

    if (result.affectedRows > 0) {
      console.log('Reserva confirmada:', result);
      res.status(200).send({ message: 'Reserva confirmada exitosamente' });
    } else {
      res.status(404).send({ message: 'Reserva no encontrada' });
    }
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
