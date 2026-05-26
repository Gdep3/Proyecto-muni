from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.auth import get_current_user, get_current_admin
import random
import string

router = APIRouter(prefix="/solicitudes", tags=["Solicitudes"])


def generar_folio() -> str:
    return "#" + "".join(random.choices(string.digits, k=5))


# ─── GET /solicitudes — ciudadano ve solo las suyas ──────────────
@router.get("/", response_model=List[schemas.SolicitudResponse])
def listar_solicitudes(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user),
):
    if current_user.rol == models.RolEnum.admin:
        return db.query(models.Solicitud).all()
    return db.query(models.Solicitud).filter(
        models.Solicitud.usuario_id == current_user.id
    ).all()


# ─── GET /solicitudes/{id} ───────────────────────────────────────
@router.get("/{solicitud_id}", response_model=schemas.SolicitudResponse)
def obtener_solicitud(
    solicitud_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user),
):
    solicitud = db.query(models.Solicitud).filter(
        models.Solicitud.id == solicitud_id
    ).first()

    if not solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")

    # Ciudadano solo puede ver sus propias solicitudes
    if current_user.rol == models.RolEnum.ciudadano and solicitud.usuario_id != current_user.id:
        raise HTTPException(status_code=403, detail="Acceso denegado")

    return solicitud


# ─── POST /solicitudes ───────────────────────────────────────────
@router.post("/", response_model=schemas.SolicitudResponse, status_code=201)
def crear_solicitud(
    datos: schemas.SolicitudCreate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user),
):
    nueva = models.Solicitud(
        folio       = generar_folio(),
        categoria   = datos.categoria,
        asunto      = datos.asunto,
        descripcion = datos.descripcion,
        usuario_id  = current_user.id,
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva


# ─── PUT /solicitudes/{id} — solo admin ──────────────────────────
@router.put("/{solicitud_id}", response_model=schemas.SolicitudResponse)
def actualizar_solicitud(
    solicitud_id: int,
    datos: schemas.SolicitudUpdate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin),
):
    solicitud = db.query(models.Solicitud).filter(
        models.Solicitud.id == solicitud_id
    ).first()

    if not solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")

    if datos.estado is not None:
        solicitud.estado = datos.estado
    if datos.respuesta is not None:
        solicitud.respuesta = datos.respuesta

    db.commit()
    db.refresh(solicitud)
    return solicitud


# ─── DELETE /solicitudes/{id} — solo admin ───────────────────────
@router.delete("/{solicitud_id}", status_code=204)
def eliminar_solicitud(
    solicitud_id: int,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin),
):
    solicitud = db.query(models.Solicitud).filter(
        models.Solicitud.id == solicitud_id
    ).first()

    if not solicitud:
        raise HTTPException(status_code=404, detail="Solicitud no encontrada")

    db.delete(solicitud)
    db.commit()