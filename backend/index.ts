import express, { Request, Response } from 'express';
import mysql, { RowDataPacket } from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'clave_de_respaldo_insegura';

interface Usuario extends RowDataPacket {
  rut: string;
  nombre: string;
  correo: string;
  contrasena: string; // Necesario para extraerla y compararla
  rol: 'admin' | 'ciudadano';
  region?: string;
  comuna?: string;
}

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: "Servidor encendido, seguro y corriendo con éxito 🚀" });
});

app.post('/api/registro', async (req: Request, res: Response): Promise<void> => {
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

    const saltRounds = 10;
    const passwordEncriptada = await bcrypt.hash(contrasena, saltRounds);

    await db.query(
      'INSERT INTO usuarios (rut, nombre, correo, contrasena, rol, region, comuna) VALUES (?, ?, ?, ?, "ciudadano", ?, ?)',
      [rut, nombre, correo, passwordEncriptada, region, comuna]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Cuenta creada exitosamente' 
    });

  } catch (error) {
    console.error("Error en la base de datos al registrar:", error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

app.post('/api/login', async (req: Request, res: Response): Promise<void> => {
  const { rut, contrasena } = req.body;

  try {
    const [rows] = await db.query<Usuario[]>(
      'SELECT rut, nombre, correo, contrasena, rol FROM usuarios WHERE rut = ?', 
      [rut]
    );

    if (rows.length === 0) {
      res.status(401).json({ success: false, message: 'RUT o contraseña incorrectos' });
      return;
    }

    const usuario = rows[0];

    const passwordCorrecta = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordCorrecta) {
      res.status(401).json({ success: false, message: 'RUT o contraseña incorrectos' });
      return;
    }

    const tokenPayload = {
      rut: usuario.rut,
      rol: usuario.rol
    };
    
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '2h' });

    res.json({ 
      success: true,
      token: token, 
      role: usuario.rol, 
      user: {
        nombre: usuario.nombre,
        rut: usuario.rut,
        correo: usuario.correo
      }
    });

  } catch (error) {
    console.error("Error en la base de datos:", error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});