from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from middleware.auth import get_current_admin, get_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

class UsuarioRolUpdate(BaseModel):
    rol: str

# ─── GET /usuarios — solo admin ──────────────────────────────────
@router.get("/", response_model=List[schemas.UsuarioResponse])
def listar_usuarios(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin),
):
    return db.query(models.Usuario).all()

# ─── GET /usuarios/{id} ──────────────────────────────────────────
@router.get("/{usuario_id}", response_model=schemas.UsuarioResponse)
def obtener_usuario(
    usuario_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin),
):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario

# ─── PUT /usuarios/{id}/rol — cambiar rol (solo admin) ───────────
@router.put("/{usuario_id}/rol", response_model=schemas.UsuarioResponse)
def cambiar_rol(
    usuario_id: int,
    datos: UsuarioRolUpdate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin),
):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if datos.rol not in ['ciudadano', 'admin']:
        raise HTTPException(status_code=400, detail="Rol inválido")
    # No permitir que el admin se cambie su propio rol
    if usuario.id == current_user.id:
        raise HTTPException(status_code=400, detail="No puedes cambiar tu propio rol")
    usuario.rol = datos.rol
    db.commit()
    db.refresh(usuario)
    return usuario

# ─── DELETE /usuarios/{id} — solo admin ─────────────────────────
@router.delete("/{usuario_id}", status_code=204)
def eliminar_usuario(
    usuario_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin),
):
    usuario = db.query(models.Usuario).filter(models.Usuario.id == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if usuario.id == current_user.id:
        raise HTTPException(status_code=400, detail="No puedes eliminar tu propia cuenta")
    db.delete(usuario)
    db.commit()