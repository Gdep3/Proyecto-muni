from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from middleware.auth import get_current_admin, get_current_user
from sqlalchemy.orm import Session



router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.put("/usuarios/{rut_usuario}/rol")
def cambiar_rol(
    rut_usuario: str, 
    nuevo_rol: str, # Deberá ser 'admin' o 'ciudadano'
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user)
):
    if current_user.rol != models.RolEnum.admin:
        raise HTTPException(status_code=403, detail="Acceso denegado: Solo los administradores pueden cambiar roles.")

    usuario_destino = db.query(models.Usuario).filter(models.Usuario.rut == rut_usuario).first()
    
    if not usuario_destino:
        raise HTTPException(status_code=404, detail="Usuario no encontrado.")

    if nuevo_rol == 'admin':
        usuario_destino.rol = models.RolEnum.admin
    else:
        usuario_destino.rol = models.RolEnum.ciudadano
        
    db.commit()
    
    return {"mensaje": f"El rol de {rut_usuario} ha sido actualizado exitosamente a {nuevo_rol}"}

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
    usuario_id: str,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin),
):
    usuario = db.query(models.Usuario).filter(models.Usuario.rut == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return usuario


# ─── DELETE /usuarios/{id} — solo admin ─────────────────────────
@router.delete("/{usuario_id}", status_code=204)
def eliminar_usuario(
    usuario_id: str,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin),
):
    usuario = db.query(models.Usuario).filter(models.Usuario.rut == usuario_id).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(usuario)
    db.commit()