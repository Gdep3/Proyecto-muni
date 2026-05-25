from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app import models, schemas

import csv, io, re
from fastapi import UploadFile, File

from app.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/gastos", tags=["Gastos"])

@router.get("/", response_model=List[schemas.GastoResponse])
def listar_gastos(
    año: Optional[int] = Query(None),
    area: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Gasto)
    if año:
        query = query.filter(models.Gasto.año == año)
    if area and area != "Total":
        query = query.filter(models.Gasto.area == area)
    return query.all()

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