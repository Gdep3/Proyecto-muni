from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

# ─── Enums ───────────────────────────────────────────────────────
class RolEnum(str, enum.Enum):
    ciudadano = "ciudadano"
    admin     = "admin"

class EstadoSolicitudEnum(str, enum.Enum):
    pendiente  = "pendiente"
    respondida = "respondida"

# ─── Tabla: usuarios ─────────────────────────────────────────────
class Usuario(Base):
    __tablename__ = "usuarios"

    id         = Column(Integer, primary_key=True, index=True)
    nombre     = Column(String(100), nullable=False)
    rut        = Column(String(12), unique=True, nullable=False, index=True)
    email      = Column(String(150), unique=True, nullable=False, index=True)
    region     = Column(String(100), nullable=True)
    comuna     = Column(String(100), nullable=True)
    password   = Column(String(255), nullable=False)  # bcrypt hash
    rol        = Column(Enum(RolEnum), default=RolEnum.ciudadano, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relación con solicitudes
    solicitudes = relationship("Solicitud", back_populates="usuario")


# ─── Tabla: solicitudes ───────────────────────────────────────────
class Solicitud(Base):
    __tablename__ = "solicitudes"

    id          = Column(Integer, primary_key=True, index=True)
    folio       = Column(String(20), unique=True, nullable=False, index=True)
    categoria   = Column(String(100), nullable=False)
    asunto      = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=False)
    estado      = Column(Enum(EstadoSolicitudEnum), default=EstadoSolicitudEnum.pendiente)
    respuesta   = Column(Text, nullable=True)
    usuario_id  = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())

    # Relación con usuario
    usuario = relationship("Usuario", back_populates="solicitudes")