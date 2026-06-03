from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from datetime import datetime
from app.models import RolEnum, EstadoSolicitudEnum
import re

# Usuario

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
    nombre: str
    rut: str
    email: str
    region: Optional[str]
    comuna: Optional[str]
    rol: RolEnum
    created_at: datetime

    class Config:
        from_attributes = True
        orm_mode = True


# Auth

class LoginRequest(BaseModel):
    rut: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    rol: RolEnum
    nombre: str


# Solicitud

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
    usuario_id: str
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True
        orm_mode = True

# Gastos

class GastoResponse(BaseModel):
    id: int
    año: int
    mes: int
    area: str
    monto: int

    class Config:
        from_attributes = True
        orm_mode = True
class GastoCreate(BaseModel):
    año: int
    mes: int
    area: str
    monto: int

class GastoUpdate(BaseModel):
    año: Optional[int] = None
    mes: Optional[int] = None
    area: Optional[str] = None
    monto: Optional[int] = None

# Documentos

class DocumentoResponse(BaseModel):
    id:          int
    codigo:      Optional[str]
    tipo:        Optional[str]
    categoria:   Optional[str]
    area:        Optional[str]
    fecha_pub:   Optional[str]
    descripcion: Optional[str]
    enlace:      Optional[str]
    año:         Optional[int]
    mes:         Optional[int]

    class Config:
        from_attributes = True
        orm_mode = True
class DocumentoCreate(BaseModel):
    codigo: str
    tipo: str
    categoria: str
    area: str
    fecha_pub: str
    descripcion: str
    enlace: str
    año: int
    mes: int

class DocumentoUpdate(BaseModel):
    codigo: Optional[str] = None
    tipo: Optional[str] = None
    categoria: Optional[str] = None
    area: Optional[str] = None
    fecha_pub: Optional[str] = None
    descripcion: Optional[str] = None
    enlace: Optional[str] = None
    año: Optional[int] = None
    mes: Optional[int] = None