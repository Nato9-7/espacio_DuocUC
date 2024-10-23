// Controlador de usuario

exports.obtenerUsuarios = (req, res) => {
    // Aquí va la lógica para obtener los usuarios de la base de datos
    const sql = 'SELECT * FROM usuario';
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error al obtener usuarios:', err);
        return res.status(500).send('Error en el servidor');
      }
  
      res.json(results);  // Envía los resultados al cliente
    });
  };
  