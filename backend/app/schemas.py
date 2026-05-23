from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime
from app.models import RolEnum, EstadoSolicitudEnum
import re

# ─── Usuario ─────────────────────────────────────────────────────

class UsuarioCreate(BaseModel):
    nombre: str
    rut: str
    email: EmailStr
    region: Optional[str] = None
    comuna: Optional[str] = None
    password: str

    @validator('rut')
    def validar_rut(cls, v):
        rut_limpio = v.replace('.', '').replace('-', '')
        if not re.match(r'^\d{7,8}[0-9kK]$', rut_limpio):
            raise ValueError('RUT inválido')
        return v

    @validator('password')
    def validar_password(cls, v):
        if len(v) < 6:
            raise ValueError('La contraseña debe tener al menos 6 caracteres')
        return v


class UsuarioResponse(BaseModel):
    id: int
    nombre: str
    rut: str
    email: str
    region: Optional[str]
    comuna: Optional[str]
    rol: RolEnum
    created_at: datetime

    class Config:
        orm_mode = True  # v1 usa orm_mode en vez de from_attributes


# ─── Auth ─────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    rut: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    rol: RolEnum
    nombre: str


# ─── Solicitud ────────────────────────────────────────────────────

class SolicitudCreate(BaseModel):
    categoria: str
    asunto: str
    descripcion: str


class SolicitudUpdate(BaseModel):
    estado: Optional[EstadoSolicitudEnum] = None
    respuesta: Optional[str] = None


class SolicitudResponse(BaseModel):
    id: int
    folio: str
    categoria: str
    asunto: str
    descripcion: str
    estado: EstadoSolicitudEnum
    respuesta: Optional[str]
    usuario_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True  # v1 usa orm_mode en vez de from_attributes