from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Form, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from middleware.auth import get_current_admin
from middleware.supabase_storage import subir_archivo_a_supabase 
from fastapi.responses import StreamingResponse
import csv, io, re, httpx, time

router = APIRouter(prefix="/documentos", tags=["Documentos"])

@router.post("/subir", response_model=schemas.DocumentoResponse, status_code=status.HTTP_201_CREATED)
async def crear_documento(
    codigo: str = Form(...),
    tipo: str = Form(...),
    categoria: str = Form(""),
    area: str = Form(""),
    descripcion: str = Form(""),
    año: int = Form(None),
    mes: int = Form(None),
    fecha_pub: str = Form(""),
    archivo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.Usuario = Depends(get_current_admin)  # Solo administradores
):
    if archivo.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Solo se permiten archivos PDF"
        )

    try:
        enlace_supabase = await subir_archivo_a_supabase(archivo)
        
        nuevo_doc = models.Documento(
            codigo=codigo,
            tipo=tipo,
            categoria=categoria,
            area=area,
            descripcion=descripcion,
            enlace_contrato=enlace_supabase,
            enlace_acto=None,
            año=año,
            mes=mes,
            fecha_pub=fecha_pub
        )
        
        db.add(nuevo_doc)
        db.commit()
        db.refresh(nuevo_doc)
        
        return nuevo_doc
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Error al procesar y guardar el documento: {str(e)}"
        )

@router.get("/", response_model=List[schemas.DocumentoResponse])
def listar_documentos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    return db.query(models.Documento).order_by(
        models.Documento.id.desc()
    ).offset(skip).limit(limit).all()

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

    from supabase import create_client
    import os
    supabase_client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
    bucket_name = "documentos"
    insertados = 0
    
    # Función interna auxiliar para no repetir código de descarga/subida
    async def descargar_y_subir_a_supabase(client_http, html_enlace, prefijo, codigo_doc):
        if not html_enlace:
            return None
        match = re.search(r'href=["\']([^"\']+)["\']', html_enlace)
        if match:
            url_original = match.group(1)
            try:
                response = await client_http.get(url_original, timeout=15.0)
                if response.status_code == 200:
                    nombre_archivo = f"{prefijo}_{codigo_doc}_{int(time.time())}.pdf"
                    supabase_client.storage.from_(bucket_name).upload(
                        path=nombre_archivo,
                        file=response.content,
                        file_options={"content-type": "application/pdf"}
                    )
                    return supabase_client.storage.from_(bucket_name).get_public_url(nombre_archivo)
            except Exception as e:
                print(f"Error procesando {prefijo} para {codigo_doc}: {e}")
        return None

    async with httpx.AsyncClient() as client:
        for row in reader:
            try:
                codigo_doc = row.get('Número del acto administrativo aprobatorio', 'doc').replace('/', '_')
                
                # Columnas del CSV correspondientes a los dos archivos
                columna_contrato = row.get('Enlace al texto integro del contrato', '')
                columna_acto = row.get('Enlace al texto integro del acto administrativo aprobatorio', '')

                # Descargamos y subimos de forma independiente cada uno
                url_supabase_contrato = await descargar_y_subir_a_supabase(client, columna_contrato, "contrato", codigo_doc)
                url_supabase_acto = await descargar_y_subir_a_supabase(client, columna_acto, "resolucion", codigo_doc)

                # Si falló la descarga, usamos el HTML original como respaldo para no perder el dato
                doc = models.Documento(
                    codigo      = row.get('Número del acto administrativo aprobatorio', ''),
                    tipo        = row.get('Tipo documento', row.get('Tipo de Compra', '')),
                    categoria   = row.get('Categoría', row.get('Tipo de Compra', '')),
                    area        = row.get('Tipo de Compra', ''),
                    fecha_pub   = row.get('Fecha del acto administrativo aprobatorio del contrato', ''),
                    descripcion = row.get('Objeto de la contratación o adquisición', ''),
                    
                    # Guardamos las dos URLs independientes
                    enlace_contrato = url_supabase_contrato if url_supabase_contrato else columna_contrato,
                    enlace_acto     = url_supabase_acto if url_supabase_acto else columna_acto,
                    
                    año         = int(row.get('Año')) if row.get('Año', '').isdigit() else None,
                    mes         = _mes_a_numero(row.get('Mes', '')),
                )
                db.add(doc)
                insertados += 1
            except Exception as e:
                print(f"Error en fila: {e}")
                continue

        db.commit()
        
    return {"mensaje": f"{insertados} registros importados con sus respectivos documentos."}

def _mes_a_numero(mes_str: str) -> int:
    meses = {
        'enero':1,'febrero':2,'marzo':3,'abril':4,
        'mayo':5,'junio':6,'julio':7,'agosto':8,
        'septiembre':9,'octubre':10,'noviembre':11,'diciembre':12
    }
    return meses.get(mes_str.lower().strip(), 1)

@router.get("/descargar/todos")
def descargar_todos_csv(db: Session = Depends(get_db)):
    documentos = db.query(models.Documento).order_by(models.Documento.id.desc()).all()
    return _generar_csv(documentos, "documentos_todos.csv")

@router.get("/descargar/{doc_id}")
def descargar_uno_csv(doc_id: int, db: Session = Depends(get_db)):
    doc = db.query(models.Documento).filter(models.Documento.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Documento no encontrado")
    return _generar_csv([doc], f"documento_{doc_id}.csv")

def _generar_csv(documentos, filename: str):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['ID', 'Código', 'Tipo', 'Categoría', 'Área', 'Fecha', 'Descripción', 'Enlace Contrato', 'Enlace Acto', 'Año', 'Mes'])
    for doc in documentos:
        writer.writerow([
            doc.id, doc.codigo, doc.tipo, doc.categoria,
            doc.area, doc.fecha_pub, doc.descripcion,
            doc.enlace_contrato, doc.enlace_acto, doc.año, doc.mes
        ])
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode('utf-8-sig')),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

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