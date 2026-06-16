from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.database import engine, Base
from app.routers import auth, solicitudes, usuarios, gastos, documentos
import time
from collections import defaultdict

# Crea todas las tablas en la BD si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Municipalidad Santo Domingo",
    description="Backend para el Portal de Transparencia Municipal",
    version="1.0.0",
)

# ─── CORS ────────────────────────────────────────────────────────
# Cubre: desarrollo local, Ionic DevServer, y el contenedor Docker del frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev local
        "http://localhost:8100",   # Ionic serve local
        "http://localhost:8000",   # Backend local
        "http://localhost",        # Docker frontend (puerto 80)
        "http://ionic_frontend",   # Nombre del contenedor Docker
        "http://ionic_frontend:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── RATE LIMITING en /auth/login ────────────────────────────────
# Máximo 10 intentos por IP cada 60 segundos
_login_attempts: dict = defaultdict(list)
MAX_INTENTOS  = 10
VENTANA_SEG   = 60

@app.middleware("http")
async def rate_limit_login(request: Request, call_next):
    if request.url.path == "/auth/login" and request.method == "POST":
        ip = request.client.host
        ahora = time.time()

        # Limpia intentos fuera de la ventana
        _login_attempts[ip] = [
            t for t in _login_attempts[ip] if ahora - t < VENTANA_SEG
        ]

        if len(_login_attempts[ip]) >= MAX_INTENTOS:
            return JSONResponse(
                status_code=429,
                content={"detail": f"Demasiados intentos. Espera {VENTANA_SEG} segundos."},
            )

        _login_attempts[ip].append(ahora)

    return await call_next(request)

# ─── ROUTERS ─────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(solicitudes.router)
app.include_router(usuarios.router)
app.include_router(gastos.router)
app.include_router(documentos.router)

# ─── HEALTH CHECK ────────────────────────────────────────────────
@app.get("/", tags=["Estado"])
def root():
    return {"mensaje": "API Municipalidad Santo Domingo funcionando ✓"}