from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from middleware.auth import get_current_admin
from fastapi.responses import StreamingResponse
import csv, io, re
from fastapi import status

router = APIRouter(prefix="/documentos", tags=["Documentos"])

@router.get("/", response_model=List[schemas.DocumentoResponse])
def listar_documentos(db: Session = Depends(get_db)):
    return db.query(models.Documento).order_by(models.Documento.id.desc()).all()

@router.get("/filtros")
def obtener_filtros(db: Session = Depends(get_db)):
    años = db.query(models.Documento.año).distinct().filter(
        models.Documento.año != None
    ).all()
    areas = db.query(models.Documento.area).distinct().filter(
        models.Documento.area != None, models.Documento.area != ''
    ).all()
    return {
        "años":  sorted([a[0] for a in años], reverse=True),
        "areas": sorted([a[0] for a in areas]),
    }

@router.get("/{doc_id}", response_model=schemas.DocumentoResponse)
def obtener_documento(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(models.Documento).filter(models.Documento.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return doc

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
            año_val = row.get('Año', '')
            mes_val = row.get('Mes', '')
            doc = models.Documento(
                codigo      = row.get('Número del acto administrativo aprobatorio', ''),
                tipo        = row.get('Tipo documento', row.get('Tipo de Compra', '')),
                categoria   = row.get('Categoría', row.get('Tipo de Compra', '')),
                area        = row.get('Tipo de Compra', ''),
                fecha_pub   = row.get('Fecha de publicación', row.get('Fecha del acto administrativo aprobatorio del contrato', '')),
                descripcion = row.get('Descripción', row.get('Objeto de la contratación o adquisición', '')),
                enlace      = row.get('Texto', row.get('Enlace al texto integro del contrato', '')),
                año         = int(año_val) if año_val.isdigit() else None,
                mes         = _mes_a_numero(mes_val),
            )
            db.add(doc)
            insertados += 1
        except Exception:
            continue

        try:
            monto_str = re.sub(r'[^\d]', '', row.get('Monto total de la operación', '0'))
            monto = int(monto_str) if monto_str else 0
            
            if monto > 0 and año_val.isdigit():
                gasto = models.Gasto(
                    año   = int(año_val),
                    mes   = _mes_a_numero(mes_val),
                    area  = row.get('Tipo de Compra', 'Sin categoría'),
                    monto = monto,
                )
                db.add(gasto)
        except Exception:
            pass

    db.commit()
    return {"mensaje": f"{insertados} documentos importados"}


def _mes_a_numero(mes_str: str) -> int:
    meses = {
        'enero':1,'febrero':2,'marzo':3,'abril':4,
        'mayo':5,'junio':6,'julio':7,'agosto':8,
        'septiembre':9,'octubre':10,'noviembre':11,'diciembre':12
    }
    return meses.get(mes_str.lower().strip(), 1)

# Descargar todos como CSV
@router.get("/descargar/todos")
def descargar_todos_csv(db: Session = Depends(get_db)):
    documentos = db.query(models.Documento).order_by(models.Documento.id.desc()).all()
    return _generar_csv(documentos, "documentos_todos.csv")

# Descargar uno como CSV
@router.get("/descargar/{doc_id}")
def descargar_uno_csv(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(models.Documento).filter(models.Documento.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return _generar_csv([doc], f"documento_{doc_id}.csv")

def _generar_csv(documentos, filename: str):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['ID', 'Código', 'Tipo', 'Categoría', 'Área', 'Fecha', 'Descripción', 'Enlace', 'Año', 'Mes'])
    for doc in documentos:
        writer.writerow([
            doc.id, doc.codigo, doc.tipo, doc.categoria,
            doc.area, doc.fecha_pub, doc.descripcion,
            doc.enlace, doc.año, doc.mes
        ])
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode('utf-8-sig')),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
# UPDATE (PUT)
@router.put("/{doc_id}", response_model=schemas.DocumentoResponse)
def actualizar_documento(
    doc_id: int, 
    doc_update: schemas.DocumentoUpdate, 
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin)
):
    db_doc = db.query(models.Documento).filter(models.Documento.id == doc_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    update_data = doc_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_doc, key, value)
        
    db.commit()
    db.refresh(db_doc)
    return db_doc

# DELETE
@router.delete("/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_documento(
    doc_id: int, 
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin)
):
    db_doc = db.query(models.Documento).filter(models.Documento.id == doc_id).first()
    if not db_doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    
    db.delete(db_doc)
    db.commit()
    return {"mensaje": "Documento eliminado exitosamente"}
