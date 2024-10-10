const express = require('express');
const mysql = require('mysql');
const cors = require('cors');  // Agregar cors
const app = express();

// Usar CORS
app.use(cors());

// Configurar la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin', 
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
      res.status(500).send('Error en la consulta');
      return;
    }
    res.json(results);
  });
});

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
