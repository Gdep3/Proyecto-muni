from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas

import csv, io, re
from fastapi import UploadFile, File

from middleware.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/gastos", tags=["Gastos"])

@router.get("/filtros")
def obtener_filtros_gastos(db: Session = Depends(get_db)):
    """Retorna los años y áreas disponibles en la BD para poblar los selectores del frontend."""
    años = db.query(models.Gasto.año).distinct().filter(
        models.Gasto.año != None
    ).all()
    areas = db.query(models.Gasto.area).distinct().filter(
        models.Gasto.area != None, models.Gasto.area != ''
    ).all()
    return {
        "años":  sorted([a[0] for a in años], reverse=True),
        "areas": sorted([a[0] for a in areas]),
    }

@router.get("/", response_model=List[schemas.GastoResponse])
def listar_gastos(
    año: Optional[int] = Query(None),
    area: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(500, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    query = db.query(models.Gasto)
    if año:
        query = query.filter(models.Gasto.año == año)
    if area and area != "Total":
        query = query.filter(models.Gasto.area == area)
    return query.offset(skip).limit(limit).all()

@router.post("/importar")
async def importar_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin),
):
    contenido = await file.read()
    texto = contenido.decode('utf-8-sig')
    reader = csv.DictReader(io.StringIO(texto), delimiter=';')

    insertados = 0
    for row in reader:
        try:
            # Limpiar el monto: quitar "$", ".", espacios
            monto_str = row.get('Monto total de la operación', '0')
            monto_str = re.sub(r'[^\d]', '', monto_str)
            monto = int(monto_str) if monto_str else 0

            gasto = models.Gasto(
                año   = int(row['Año']),
                mes   = _mes_a_numero(row['Mes']),
                area  = row.get('Tipo de Compra', 'Sin categoría'),
                monto = monto,
            )
            db.add(gasto)
            insertados += 1
        except Exception:
            continue

    db.commit()
    return {"mensaje": f"{insertados} registros importados"}


def _mes_a_numero(mes_str: str) -> int:
    meses = {
        'enero':1,'febrero':2,'marzo':3,'abril':4,
        'mayo':5,'junio':6,'julio':7,'agosto':8,
        'septiembre':9,'octubre':10,'noviembre':11,'diciembre':12
    }
    return meses.get(mes_str.lower().strip(), 1)

from fastapi import HTTPException, status

# POST Individual
@router.post("/", response_model=schemas.GastoResponse, status_code=status.HTTP_201_CREATED)
def crear_gasto(
    gasto: schemas.GastoCreate, 
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin) # Protegido, solo admin
):
    nuevo_gasto = models.Gasto(**gasto.dict())
    db.add(nuevo_gasto)
    db.commit()
    db.refresh(nuevo_gasto)
    return nuevo_gasto

# PUT (Actualizar)
@router.put("/{id}", response_model=schemas.GastoResponse)
def actualizar_gasto(
    id: int, 
    gasto_update: schemas.GastoUpdate, 
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin) # Protegido
):
    db_gasto = db.query(models.Gasto).filter(models.Gasto.id == id).first()
    if not db_gasto:
        raise HTTPException(status_code=404, detail="Gasto no encontrado")
    
    # Actualizar solo los campos que se enviaron
    update_data = gasto_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_gasto, key, value)
        
    db.commit()
    db.refresh(db_gasto)
    return db_gasto

# DELETE (Eliminar)
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_gasto(
    id: int, 
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin) # Protegido
):
    db_gasto = db.query(models.Gasto).filter(models.Gasto.id == id).first()
    if not db_gasto:
        raise HTTPException(status_code=404, detail="Gasto no encontrado")
    
    db.delete(db_gasto)
    db.commit()
    return {"mensaje": "Gasto eliminado exitosamente"}