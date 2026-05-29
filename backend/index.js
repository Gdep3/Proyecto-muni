const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuraciones iniciales
app.use(cors());
app.use(express.json()); // Permite recibir datos en formato JSON (como el RUT y clave)

// Crear el Pool de conexión a Clever Cloud usando las variables del .env
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10
}).promise(); // Usamos .promise() para poder usar async/await de forma moderna

// --- TUS ENDPOINTS DE LA API ---

// 1. Ruta de prueba para saber si el backend responde
app.get('/api/health', (req, res) => {
  res.json({ status: "Servidor encendido y corriendo con éxito" });
});

// 2. Endpoint de Login Real (Consulado en base de datos)
app.post('/api/login', async (req, res) => {
  const { rut, contrasena } = req.body;

  try {
    // Consulta SQL directa a la tabla usuarios que creaste en Clever Cloud
    const [rows] = await db.query(
      'SELECT rut, nombre, correo, rol FROM usuarios WHERE rut = ? AND contrasena = ?', 
      [rut, contrasena]
    );

    if (rows.length > 0) {
      // Si el usuario existe, devolvemos sus datos y su rol real ('admin' o 'ciudadano')
      res.json({ 
        success: true, 
        role: rows[0].rol,
        user: rows[0]
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'El RUT o la contraseña son incorrectos' 
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Levantar el servidor en el puerto configurado (por defecto 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
});