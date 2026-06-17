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

@router.put("/{rut_usuario}/rol")
def actualizar_rol_usuario(
    rut_usuario: str,
    datos: UsuarioRolUpdate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin)
):
    # Buscamos al usuario por su RUT
    usuario_db = db.query(models.Usuario).filter(models.Usuario.rut == rut_usuario).first()
    
    if not usuario_db:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Validamos que el rol sea correcto
    nuevo_rol = datos.rol.lower()
    if nuevo_rol not in ["admin", "ciudadano"]:
        raise HTTPException(status_code=400, detail="Rol inválido")
        
    # Aplicamos el cambio y guardamos
    usuario_db.rol = nuevo_rol
    db.commit()
    
    return {"mensaje": f"Rol actualizado exitosamente a {nuevo_rol}"}