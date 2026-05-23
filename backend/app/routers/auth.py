from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.auth import hash_password, verify_password, create_access_token
import random

router = APIRouter(prefix="/auth", tags=["Autenticación"])


# ─── POST /auth/register ─────────────────────────────────────────
@router.post("/register", response_model=schemas.UsuarioResponse, status_code=201)
def register(datos: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    # Verificar RUT duplicado
    if db.query(models.Usuario).filter(models.Usuario.rut == datos.rut).first():
        raise HTTPException(status_code=400, detail="El RUT ya está registrado")

    # Verificar email duplicado
    if db.query(models.Usuario).filter(models.Usuario.email == datos.email).first():
        raise HTTPException(status_code=400, detail="El email ya está registrado")

    nuevo_usuario = models.Usuario(
        nombre   = datos.nombre,
        rut      = datos.rut,
        email    = datos.email,
        region   = datos.region,
        comuna   = datos.comuna,
        password = hash_password(datos.password),
        rol      = models.RolEnum.ciudadano,
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario


# ─── POST /auth/login ────────────────────────────────────────────
@router.post("/login", response_model=schemas.TokenResponse)
def login(datos: schemas.LoginRequest, db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.rut == datos.rut).first()

    if not usuario or not verify_password(datos.password, usuario.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="RUT o contraseña incorrectos",
        )

    token = create_access_token(data={"sub": usuario.rut, "rol": usuario.rol})

    return {
        "access_token": token,
        "token_type":   "bearer",
        "rol":          usuario.rol,
        "nombre":       usuario.nombre,
    }