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

  // Token expirado o inválido
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
    window.location.href = '/login';
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
  login: async (rut: string, password: string) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ rut, password }),
    });
    localStorage.setItem('token',  data.access_token);
    localStorage.setItem('rol',    data.rol);
    localStorage.setItem('nombre', data.nombre);
    return data;
  },

  register: async (datos: {
    nombre: string;
    rut: string;
    email: string;
    region?: string;
    comuna?: string;
    password: string;
  }) => {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre');
  },

  getToken:  () => localStorage.getItem('token'),
  getRol:    () => localStorage.getItem('rol') as 'ciudadano' | 'admin' | null,
  getNombre: () => localStorage.getItem('nombre'),
  isAuth:    () => !!localStorage.getItem('token'),
};

// Solicitudes
export const solicitudesService = {
  listar: () => apiFetch('/solicitudes'),

  obtener: (id: number) => apiFetch(`/solicitudes/${id}`),

  crear: (datos: { categoria: string; asunto: string; descripcion: string }) =>
    apiFetch('/solicitudes', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),

  actualizar: (id: number, datos: { estado?: string; respuesta?: string }) =>
    apiFetch(`/solicitudes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),

  eliminar: (id: number) =>
    apiFetch(`/solicitudes/${id}`, { method: 'DELETE' }),
};

// Usuarios (solo admin)
export const usuariosService = {
  listar:  () => apiFetch('/usuarios'),
  obtener: (id: number) => apiFetch(`/usuarios/${id}`),
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
    const token = localStorage.getItem('token');
    window.open(`http://localhost:8000/documentos/descargar/todos`, '_blank');
  },

  descargarUno: (id: number) => {
    window.open(`http://localhost:8000/documentos/descargar/${id}`, '_blank');
  },
   filtros: () => apiFetch('/documentos/filtros'),
};

export const perfilService = {
  obtener: () => apiFetch('/auth/me'),
  actualizar: (datos: { email?: string; comuna?: string }) =>
    apiFetch('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),
};