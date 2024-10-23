const express = require('express');
const cors = require('cors');
const reservaRoutes = require('./rutas/rutaReserva');
const usuarioRoutes = require('./rutas/rutaUsuario'); // También tendrías rutas de usuario

const app = express();
app.use(cors());
app.use(express.json());

app.use('/reserva', reservaRoutes);
app.use('/usuario', usuarioRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
