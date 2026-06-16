import os
from fastapi import UploadFile
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Inicializamos el cliente de Supabase
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

BUCKET_NAME = "documentos"

async def subir_archivo_a_supabase(file: UploadFile, folder: str = "archivos") -> str:
    """
    Sube un archivo a Supabase Storage y retorna su URL pública.
    """
    try:
        # 1. Leemos el contenido del archivo en bytes (FastAPI lo recibe en memoria)
        contenido = await file.read()
        
        # 2. Definimos la ruta destino dentro del bucket (ej: archivos/decreto.pdf)
        file_path = f"{folder}/{file.filename}"
        
        # 3. Subimos el archivo a Supabase
        # Usamos upsert=True por si subes un archivo con el mismo nombre, lo reemplace
        supabase.storage.from_(BUCKET_NAME).upload(
            path=file_path,
            file=contenido,
            file_options={"content-type": file.content_type, "x-upsert": "true"}
        )
        
        # 4. Obtenemos y retornamos la URL pública
        url_publica = supabase.storage.from_(BUCKET_NAME).get_public_url(file_path)
        return url_publica

    except Exception as e:
        print(f"Error al subir a Supabase: {e}")
        raise e