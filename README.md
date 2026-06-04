# Ingenieria-web-y-movil

### Integrantes
- Julian Guerrero
- Isidora Osorio
- Benjamin Muñoz

# Plataforma de Gestión y Transparencia - Municipalidad de Santo Domingo

Este proyecto es una plataforma integral diseñada para la Municipalidad de Santo Domingo, que permite a los ciudadanos realizar solicitudes de información y a los funcionarios administrativos gestionar dichas solicitudes, documentos y gastos municipales.

## Tecnologías Utilizadas

**Frontend:**
* React.js con TypeScript
* Ionic Framework (Componentes UI)
* Vite (Bundler)
* React Router DOM (Manejo de rutas privadas y públicas)

**Backend:**
* Python 3
* FastAPI (Framework API RESTful)
* SQLAlchemy (ORM)
* Pydantic (Validación de esquemas de datos V1/V2)
* Uvicorn (Servidor ASGI)
* JWT (JSON Web Tokens para autenticación)

**Base de Datos:**
* MySQL (Desplegada en la nube)
* PyMySQL (Driver de conexión)

---

## Arquitectura y Decisiones de Diseño

Durante el desarrollo, se tomaron las siguientes decisiones arquitectónicas para garantizar la seguridad y robustez del sistema:

1. **Identificación Única (RUT):** Se configuró el RUT chileno como la Llave Primaria (Primary Key) en la tabla de `usuarios`, eliminando el ID numérico tradicional. Las tablas relacionadas (`solicitudes`, etc.) utilizan el RUT como Llave Foránea (Foreign Key).
2. **Seguridad OAuth2:** El sistema de login implementa `OAuth2PasswordRequestForm`. El Frontend envía las credenciales de forma segura (`application/x-www-form-urlencoded`) donde el RUT viaja bajo el estándar `username`.
3. **Mapeo de Columnas (SQLAlchemy):** Para desacoplar el código Python de la estructura estricta de la base de datos en español, se utilizó el mapeo de columnas. Por ejemplo, la variable `email` en Python se mapea directamente a la columna `correo` en MySQL, y `password` a `contrasena`.
4. **Protección de Rutas (Frontend):** Se implementó un componente `<PrivateRoute>` que valida la existencia del Token JWT en el `localStorage` y el rol del usuario (`ciudadano` o `admin`) para evitar accesos no autorizados a los dashboards.
5. **Compatibilidad Pydantic:** Los esquemas de respuesta incluyen tanto `from_attributes = True` (Pydantic V2) como `orm_mode = True` (Pydantic V1) para garantizar que el proyecto compile en diferentes entornos virtuales del equipo de desarrollo.

---

## Instalación y Ejecución Local

Para levantar este proyecto en un entorno de desarrollo, sigue estos pasos:

### 1. Configuración de la Base de Datos (.env)
En la carpeta `backend`, crea un archivo `.env` y configura la cadena de conexión a la nube:
```
DATABASE_URL=mysql+pymysql://usuario:contraseña@host.com:3306/nombre_db
```
2. Levantar el Backend (FastAPI)
Abre una terminal en la carpeta backend y ejecuta:
```
pip install -r requirements.txt
```
```
python -m uvicorn app.main:app --reload
```
El backend deberia estar levantado despues de eso.
3. Levantar el Frontend (React)
Abre una nueva terminal en la carpeta my_app y ejecuta:
```
npm install
```
```
npm run dev
```
El frontend estara disponible despues de eso.

---

## Arquitectura del Backend y Base de Datos

El proyecto utiliza una arquitectura de cliente-servidor separada. El frontend (`my_app`) consume los servicios de una API RESTful (`backend`) desarrollada en Node.js utilizando Express y TypeScript. Todos los datos, incluyendo la autenticación de ciudadanos y administradores, se almacenan de forma segura en una base de datos relacional **MySQL** alojada en la nube mediante **Clever Cloud**.

### Estructura del Repositorio
* `/my_app`: Contiene la interfaz de usuario desarrollada con Ionic, React y Vite.
* `/backend`: Contiene la lógica del servidor, los endpoints de la API (`index.ts`) y la conexión directa a la base de datos remota.

Diagrama de la base de datos

<img width="614" height="769" alt="bd_muni (1)" src="https://github.com/user-attachments/assets/b17338e7-569b-4084-bb34-93cb1b49b6de" />


## Roles y credenciales 
El sistema divide la experiencia en dos grandes areas:
* Ciudadano (app/incio): Puede ver la informacion municipal, solicitar requerimientos y ver el historial de sus solicitudes.
* Administrador (/admin/dashboard): Tiene accceso a KIPs, subida de archivos CSV para la actualizacion masiva de bases de datos, y gestion de cuentas

## Troubleshoot 
* Error 401 Unauthorized al hacer login: Verifica que las contraseñas en la base de datos esten correctamente hasheadas (encriptadas). FastAPI rechazará contraseñas en texto plano.
* Error value is not a valid dict: Asegúrate de que las librerías fastapi y pydantic estén actualizadas en tu entorno virtual.
* Pantalla en Blanco/Negro en React: Ocurre si el Token JWT expira y el navegador entra en un bucle de redirección. Borra el almacenamiento local (F12 > Application > Local Storage) y recarga la página (F5).

