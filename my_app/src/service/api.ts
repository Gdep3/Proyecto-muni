import axios from 'axios';

// Apuntamos al puerto donde está corriendo tu servidor backend local
const API_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  // Función que envía las credenciales a tu backend
  login: async (rut: string, contrasena: string) => {
    try {
      const response = await apiClient.post('/login', { rut, contrasena });
      return response.data; // Devuelve { success: true, role: '...', user: {...} }
    } catch (error: any) {
      // Capturamos el mensaje de error exacto que envía tu backend (ej. "RUT incorrecto")
      throw error.response?.data || { success: false, message: 'Error de conexión con el servidor' };
    }
  },
  register: async (datosUsuario: { 
    rut: string; 
    nombre: string; 
    correo: string; 
    contrasena: string; 
    region: string;
    comuna: string;
  }) => {
    try {
      const response = await apiClient.post('/registro', datosUsuario);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { success: false, message: 'Error al registrar la cuenta' };
    }
  }
};