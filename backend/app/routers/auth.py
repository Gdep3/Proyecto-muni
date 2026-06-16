from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
import random
from middleware.auth import hash_password, verify_password, create_access_token, get_current_user
from typing import Optional
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone

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
def login(datos: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    
    usuario = db.query(models.Usuario).filter(models.Usuario.rut == datos.username).first()

    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="RUT o contraseña incorrectos",
        )

    es_contrasena_valida = False

    try:
        es_contrasena_valida = verify_password(datos.password, usuario.password)
    
    except ValueError:
        if datos.password == usuario.password:
            es_contrasena_valida = True
            usuario.password = hash_password(datos.password) 
            db.commit()

    if not es_contrasena_valida:
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

@router.get("/me", response_model=schemas.UsuarioResponse)
def get_me(current_user: models.Usuario = Depends(get_current_user)):
    return current_user


class UsuarioUpdate(BaseModel):
    email: Optional[str] = None
    comuna: Optional[str] = None

@router.put("/me", response_model=schemas.UsuarioResponse)
def update_me(
    datos: UsuarioUpdate,
    current_user: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if datos.email:
        # Verificar que el email no esté en uso por otro usuario
        existe = db.query(models.Usuario).filter(
            models.Usuario.email == datos.email,
            models.Usuario.rut != current_user.rut
        ).first()
        if existe:
            raise HTTPException(status_code=400, detail="El email ya está en uso")
        current_user.email = datos.email
    if datos.comuna is not None:
        current_user.comuna = datos.comuna
    db.commit()
    db.refresh(current_user)
    return current_user

#--DELETE Cuenta -- #
@router.delete("/me", status_code=204)
def eliminar_mi_cuenta(
    current_user: models.Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Primero eliminar las solicitudes del usuario
    db.query(models.Solicitud).filter(
        models.Solicitud.usuario_id == current_user.id
    ).delete()
    db.delete(current_user)
    db.commit()