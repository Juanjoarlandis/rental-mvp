# app/api/upload.py
import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, Depends, HTTPException, Request
from starlette.status import HTTP_201_CREATED

from app.deps import get_current_user

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter()

@router.post("/", status_code=HTTP_201_CREATED)
async def upload_image(
    file: UploadFile,
    request: Request,
    user=Depends(get_current_user),
):
    # ───── validación simple ─────
    if file.content_type.split("/")[0] != "image":
        raise HTTPException(status_code=400, detail="Solo se permiten imágenes")

    # ───── guardado en disco ─────
    ext  = os.path.splitext(file.filename)[1]
    name = f"{uuid.uuid4()}{ext}"
    path = os.path.join(UPLOAD_DIR, name)

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ───── URL pública del archivo ─────
    # Genera la ruta absoluta basándose en el mount StaticFiles →  /uploads/…
    url = request.url_for("uploads", path=name)      # http://<host>:<port>/uploads/<uuid>.<ext>

    return {"url": str(url)}
