const express = require('express');
const cors = require('cors');
const app = express();
const usuarioRoutes = require('./rutas/rutaUsuario'); // Importar las rutas de usuario
const reservaRoutes = require('./rutas/rutaReserva');
const penalizacionRoutes = require('./rutas/rutaPenalizacion');


app.use(cors({
  origin: 'http://localhost:8100',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use('/reserva', reservaRoutes);
app.use('/penalizacion', penalizacionRoutes);

// Configurar la conexión a la base de datos
const db = require('./config/db'); // Conexión a la base de datos

// Ruta para login
app.post('/login', (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { correo, password } = req.body;

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

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
