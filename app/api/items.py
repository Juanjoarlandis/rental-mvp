# app/api/items.py
from typing import List, Optional
from urllib.parse import urlencode

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
    Request,
    Response,
    status,
)
from sqlalchemy.orm import Session

from app import crud, schemas
from app.deps import get_db, get_current_user

router = APIRouter()

# ──────────────────────────────── Crear ──────────────────────────────────────


@router.post(
    "/",
    response_model=schemas.ItemOut,
    status_code=status.HTTP_201_CREATED,
)
def create_item(
    item_in: schemas.ItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Crea un ítem asociado al usuario autenticado.
    """
    return crud.create_item(db, item_in, owner_id=current_user.id)


# ────────────────────── helpers paginación (RFC-5988) ────────────────────────


def _build_pagination_links(
    request: Request,
    skip: int,
    limit: int,
    total: int,
    **filters,
) -> str:
    """
    Devuelve la cabecera **Link** con rel="next" y/o rel="prev"
    siguiendo la RFC-5988.
    """
    links: list[str] = []

    # eliminamos skip y limit existentes (solo se permite uno por llamada)
    base_url = request.url.remove_query_params("skip")
    base_url = base_url.remove_query_params("limit")

    def _url(new_skip: int) -> str:
        # ► descartamos filtros cuyo valor sea None para no enviar "None" literal
        params = {k: v for k, v in filters.items() if v is not None}

        # urlencode con doseq=True para repetir parámetros como categories=1&categories=2
        params.update({"skip": new_skip, "limit": limit})
        return f"<{base_url}?{urlencode(params, doseq=True)}>"

    # next
    if skip + limit < total:
        links.append(f'{_url(skip + limit)}; rel="next"')

    # prev
    if skip > 0:
        prev_skip = max(skip - limit, 0)
        links.append(f'{_url(prev_skip)}; rel="prev"')

    return ", ".join(links)


# ──────────────────────────────── Leer ───────────────────────────────────────


@router.get("/", response_model=List[schemas.ItemOut])
def read_items(
    request: Request,
    response: Response,
    # ------------- paginación -------------
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    # ------------- filtros ---------------
    name: Optional[str] = None,
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    available: Optional[bool] = None,
    categories: Optional[List[int]] = Query(    # ← nuevo
        default=None,
        description="IDs de categorías (cualquiera de ellas)",
    ),
    # ------------- ordenación ------------
    order_by: Optional[str] = Query(
        None,
        pattern="^(price|name|id)$",
        description="Campo de ordenación ('price'|'name'|'id')",
    ),
    order_dir: Optional[str] = Query(
        None,
        pattern="^(asc|desc)$",
        description="Dirección ('asc'|'desc')",
    ),
    # dependencia DB
    db: Session = Depends(get_db),
):
    """
    Lista pública de ítems con filtros, paginación y soporte de ordenación.

    Devuelve además cabeceras **X-Total-Count** y **Link** para facilitar la
    integración con front-ends SPA.
    """
    items, total = crud.get_items(
        db,
        skip=skip,
        limit=limit,
        name=name,
        min_price=min_price,
        max_price=max_price,
        available=available,
        categories=categories,
        order_by=order_by,
        order_dir=order_dir,
    )

    # ► cabeceras
    response.headers["X-Total-Count"] = str(total)
    if total:
        link = _build_pagination_links(
            request,
            skip,
            limit,
            total,
            name=name,
            min_price=min_price,
            max_price=max_price,
            available=available,
            categories=categories,
            order_by=order_by,
            order_dir=order_dir,
        )
        if link:
            response.headers["Link"] = link

    return items


# ───────────────────────── Mis ítems ─────────────────────────────────────────


@router.get("/me", response_model=List[schemas.ItemOut])
def read_my_items(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Devuelve todos los ítems publicados por el usuario autenticado.
    """
    return crud.get_items_by_owner(db, current_user.id)


# ──────────────────────────── Actualizar ─────────────────────────────────────


@router.patch("/{item_id}", response_model=schemas.ItemOut)
def partial_update_item(
    item_id: int,
    item_in: schemas.ItemUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_item = crud.get_item(db, item_id)
    if not db_item or db_item.owner_id != current_user.id:
        raise HTTPException(404, "Item no encontrado")
    return crud.update_item(db, db_item, item_in)


@router.put("/{item_id}", response_model=schemas.ItemOut)
def full_update_item(
    item_id: int,
    item_in: schemas.ItemCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_item = crud.get_item(db, item_id)
    if not db_item or db_item.owner_id != current_user.id:
        raise HTTPException(404, "Item no encontrado")
    # Reutilizamos la lógica de PATCH convirtiendo ItemCreate → ItemUpdate
    return crud.update_item(
        db,
        db_item,
        schemas.ItemUpdate(**item_in.model_dump()),
    )


# ──────────────────────────── Eliminar ───────────────────────────────────────


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db_item = crud.get_item(db, item_id)
    if not db_item or db_item.owner_id != current_user.id:
        raise HTTPException(404, "Item no encontrado")
    crud.delete_item(db, db_item)
