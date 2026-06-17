from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from middleware.auth import get_current_user, get_current_admin
from app.routers.notificaciones import enviar_notificacion_respuesta
import random, string

router = APIRouter(prefix="/solicitudes", tags=["Solicitudes"])

def generar_folio() -> str:
    return "#" + "".join(random.choices(string.digits, k=5))

# ─── GET /solicitudes ─────────────────────────────────────────────
@router.get("/", response_model=List[schemas.SolicitudResponse])
def listar_solicitudes(
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user),
):
    if current_user.rol == models.RolEnum.admin:
        return db.query(models.Solicitud).order_by(models.Solicitud.created_at.desc()).all()
    return db.query(models.Solicitud).filter(
        models.Solicitud.usuario_id == current_user.rut
    ).order_by(models.Solicitud.created_at.desc()).all()

# ─── GET /solicitudes/{id} ────────────────────────────────────────
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
    if current_user.rol == models.RolEnum.ciudadano and solicitud.usuario_id != current_user.rut:
        raise HTTPException(status_code=403, detail="Acceso denegado")
    return solicitud

# ─── POST /solicitudes ────────────────────────────────────────────
@router.post("/", response_model=schemas.SolicitudResponse, status_code=201)
def crear_solicitud(
    datos: schemas.SolicitudCreate,
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_user),
):
    # Sanitizar inputs — remover caracteres peligrosos
    asunto      = datos.asunto.replace('<', '&lt;').replace('>', '&gt;')
    descripcion = datos.descripcion.replace('<', '&lt;').replace('>', '&gt;')

    nueva = models.Solicitud(
        folio       = generar_folio(),
        categoria   = datos.categoria,
        asunto      = asunto,
        descripcion = descripcion,
        usuario_id  = current_user.rut,
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

# ─── PUT /solicitudes/{id} — solo admin ───────────────────────────
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

    estado_anterior = solicitud.estado

    if datos.estado is not None:
        solicitud.estado = datos.estado
    if datos.respuesta is not None:
        solicitud.respuesta = datos.respuesta.replace('<', '&lt;').replace('>', '&gt;')

    db.commit()
    db.refresh(solicitud)

    # ── Enviar notificación si se marcó como respondida ──
    if (datos.estado == models.EstadoSolicitudEnum.respondida and
        estado_anterior != models.EstadoSolicitudEnum.respondida):
        ciudadano = db.query(models.Usuario).filter(
            models.Usuario.rut == solicitud.usuario_id
        ).first()
        if ciudadano:
            enviar_notificacion_respuesta(
                email_destino      = ciudadano.email,
                nombre_ciudadano   = ciudadano.nombre,
                folio              = solicitud.folio,
                asunto             = solicitud.asunto,
                respuesta          = solicitud.respuesta or '',
            )

    return solicitud

# ─── DELETE /solicitudes/{id} — solo admin ────────────────────────
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