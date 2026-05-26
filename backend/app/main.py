from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import auth, solicitudes, usuarios, gastos, documentos


# Crea todas las tablas en la BD si no existen
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API Municipalidad Santo Domingo",
    description="Backend para el Portal de Transparencia Municipal",
    version="1.0.0",
)

# CORS
# Permite que el frontend Ionic (localhost:5173) consuma la API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8100"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(solicitudes.router)
app.include_router(usuarios.router)
app.include_router(gastos.router)
app.include_router(documentos.router)


# Health check
@app.get("/", tags=["Estado"])
def root():
    return {"mensaje": "API Municipalidad Santo Domingo funcionando ✓"}