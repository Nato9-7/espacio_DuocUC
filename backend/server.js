const express = require('express');
const mysql = require('mysql');
const cors = require('cors');  
const app = express();

app.use(cors({
  origin: 'http://localhost:8100', 
  methods: ['GET', 'POST', 'DELETE'],
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
      console.log('No existen reservas para este usuario');
      res.status(404).send({ message: 'No existen reservas para este usuario' });
    }
  });
});

// Ruta para crear una nueva reserva
app.post('/reserva', (req, res) => {
  const { sala, fecha, userId } = req.body;

  // Inserta la nueva reserva en la base de datos con los valores que manejarás manualmente
  const query = "INSERT INTO RESERVA (Fecha_reserva, estado_reserva, Id_usuario, horario_id_horario, id_sala) VALUES (?, 'pendiente', ?, ?, 1)";
  
  // Aquí, horaInicio y horaFin pueden ser asignados manualmente en el query
  const horarioId = sala === 'biblioteca' ? 1 : 2; // Asigna manualmente según el tipo de sala

  db.query(query, [fecha, userId, horarioId], (err, result) => {
    if (err) {
      console.error('Error al insertar la reserva:', err);
      return res.status(500).send({ error: 'Error al crear la reserva' });
    }

    console.log('Reserva creada:', result);
    res.status(200).send({ message: 'Reserva creada exitosamente' });
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



// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
