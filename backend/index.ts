import express, { Request, Response } from 'express';
import mysql, { RowDataPacket } from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ─── INTERFACES (El súper poder de TypeScript) ───
// Le decimos a TypeScript exactamente qué columnas nos devuelve Clever Cloud
interface Usuario extends RowDataPacket {
  rut: string;
  nombre: string;
  correo: string;
  rol: 'admin' | 'ciudadano';
  region?: string;
  comuna?: string;
}

// Configuración de la base de datos
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306, // Convertimos a Number por seguridad
  waitForConnections: true,
  connectionLimit: 10
});

// ─── ENDPOINTS ───

// Ruta de prueba
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: "Servidor encendido y corriendo con éxito en TypeScript 🚀" });
});

// Endpoint de Login Real
app.post('/api/login', async (req: Request, res: Response): Promise<void> => {
  const { rut, contrasena } = req.body;

  try {
    // Inyectamos la interfaz <Usuario[]> para que el autocompletado sepa qué datos vienen
    const [rows] = await db.query<Usuario[]>(
      'SELECT rut, nombre, correo, rol FROM usuarios WHERE rut = ? AND contrasena = ?', 
      [rut, contrasena]
    );

    if (rows.length > 0) {
      const usuario = rows[0];
      res.json({ 
        success: true, 
        role: usuario.rol, 
        user: usuario 
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'El RUT o la contraseña son incorrectos' 
      });
    }
  } catch (error) {
    console.error("Error en la base de datos:", error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// Endpoint para Registrar un Nuevo Ciudadano
app.post('/api/registro', async (req: Request, res: Response): Promise<void> => {
  // Ahora extraemos también region y comuna del req.body
  const { rut, nombre, correo, contrasena, region, comuna } = req.body;

  try {
    const [usuariosExistentes] = await db.query<Usuario[]>(
      'SELECT rut FROM usuarios WHERE rut = ? OR correo = ?', 
      [rut, correo]
    );

    if (usuariosExistentes.length > 0) {
      res.status(400).json({ 
        success: false, 
        message: 'El RUT o el correo ya se encuentran registrados en el sistema' 
      });
      return;
    }

    // Actualizamos el INSERT para incluir las nuevas columnas
    await db.query(
      'INSERT INTO usuarios (rut, nombre, correo, contrasena, rol, region, comuna) VALUES (?, ?, ?, ?, "ciudadano", ?, ?)',
      [rut, nombre, correo, contrasena, region, comuna]
    );

    res.json({ 
      success: true, 
      message: 'Cuenta creada exitosamente' 
    });

  } catch (error) {
    console.error("Error en la base de datos al registrar:", error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor API corriendo en http://localhost:${PORT}`);
});