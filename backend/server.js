const express = require('express');
const mysql = require('mysql');
const cors = require('cors');  
const app = express();

app.use(cors({
  origin: 'http://localhost:8100', 
  methods: ['GET', 'POST'],
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
      console.log('Usuario encontrado:', result[0]); // Verifica si se encontró el usuario
      res.status(200).send({ message: 'Login exitoso', user: result[0] });
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
