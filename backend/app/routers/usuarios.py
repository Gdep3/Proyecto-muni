from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.auth import get_current_admin

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])


# ─── GET /usuarios — solo admin ──────────────────────────────────
@router.get("/", response_model=List[schemas.UsuarioResponse])
def listar_usuarios(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin),
):
    return db.query(models.Usuario).all()


# ─── GET /usuarios/{id} — solo admin ────────────────────────────
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
    db.delete(usuario)
    db.commit()