const BASE_URL = 'http://localhost:8000';

//Helper: fetch con JWT automático
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole'); // Ajustado para que coincida
    localStorage.removeItem('nombre');
    
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return;
  }

  // Errores del servidor
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'Error del servidor' }));
    throw { response: { data: errorData, status: res.status } };
  }

  // 204 No Content (DELETE) no tiene body
  if (res.status === 204) return null;

  return res.json();
};

//Auth 
export const authService = {
  // Función para obtener el Token y el Rol
  login: async (rut: string, contrasena: string) => {
    const formData = new URLSearchParams();
    formData.append('username', rut); 
    formData.append('password', contrasena);

    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });

    if (!loginResponse.ok) {
      throw new Error('Credenciales incorrectas');
    }

    const tokenData = await loginResponse.json();
    localStorage.setItem('token', tokenData.access_token);

    // Segunda petición para traer el perfil y el rol
    const userResponse = await fetch(`${BASE_URL}/auth/me`, { 
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` }
    });

    if (!userResponse.ok) {
      throw new Error('No se pudo obtener el perfil del usuario');
    }

    const userData = await userResponse.json();
    localStorage.setItem('userRole', userData.rol);

    return {
      success: true,
      role: userData.rol 
    };
  },

  register: async (datos: any) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    if (!res.ok) {
       const error = await res.json();
       throw new Error(error.detail || 'Error al registrar');
    }
    return { success: true };
  },

  isAuth: () => {
    return !!localStorage.getItem('token');
  },
  
  getRol: () => {
    return localStorage.getItem('userRole');
  },

  logout: () => {
    // Limpia la memoria al cerrar sesión
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('nombre');
  }
};

// Solicitudes
export const solicitudesService = {
  listar: () => apiFetch('/solicitudes'),
  obtener: (id: number) => apiFetch(`/solicitudes/${id}`),
  crear: (datos: { categoria: string; asunto: string; descripcion: string }) =>
    apiFetch('/solicitudes', { method: 'POST', body: JSON.stringify(datos) }),
  actualizar: (id: number, datos: { estado?: string; respuesta?: string }) =>
    apiFetch(`/solicitudes/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  eliminar: (id: number) => apiFetch(`/solicitudes/${id}`, { method: 'DELETE' }),
};

// Usuarios (solo admin)
export const usuariosService = {
  listar:     () => apiFetch('/usuarios'),
  obtener:    (id: number) => apiFetch(`/usuarios/${id}`),
  cambiarRol: (id: number, rol: string) => apiFetch(`/usuarios/${id}/rol`, {
    method: 'PUT', body: JSON.stringify({ rol }),
  }),
  eliminar:   (id: number) => apiFetch(`/usuarios/${id}`, { method: 'DELETE' }),
};

// Gastos
export const gastosService = {
  listar: (año?: number, area?: string) => {
    const params = new URLSearchParams();
    if (año)  params.append('año', String(año));
    if (area) params.append('area', area);
    return apiFetch(`/gastos?${params.toString()}`);
  },
};

// Documentos 
export const documentosService = {
  listar:  () => apiFetch('/documentos'),
  obtener: (id: number) => apiFetch(`/documentos/${id}`),
  descargarTodos: () => {
    window.open(`${BASE_URL}/documentos/descargar/todos`, '_blank');
  },
  descargarUno: (id: number) => {
    window.open(`${BASE_URL}/documentos/descargar/${id}`, '_blank');
  },
  filtros: () => apiFetch('/documentos/filtros'),
};

export const perfilService = {
  obtener:          () => apiFetch('/auth/me'),
  actualizar:       (datos: any) => apiFetch('/auth/me', { method: 'PUT', body: JSON.stringify(datos) }),
  eliminarCuenta:   () => apiFetch('/auth/me', { method: 'DELETE' }),
};

