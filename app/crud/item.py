# app/crud/item.py
from __future__ import annotations

from typing import List, Optional, Tuple

from sqlalchemy import asc, desc, or_
from sqlalchemy.orm import Session, joinedload

from app.models.models import Category, Item, ItemImage
from app.schemas.item import ItemCreate, ItemUpdate

# ───────────────────────── helpers privados ────────────────────────────────
def _get_categories_or_400(db: Session, ids: list[int]) -> list[Category]:
    """
    Devuelve la lista de categorías cuyo id esté en *ids* o lanza ValueError
    si alguna no existe.
    """
    cats = db.query(Category).filter(Category.id.in_(ids)).all()
    if len(cats) != len(ids):
        missing = set(ids) - {c.id for c in cats}
        raise ValueError(f"Categoría(s) inexistente(s): {', '.join(map(str, missing))}")
    return cats


def _apply_ordering(query, order_by: str | None, order_dir: str | None):
    """
    Aplica la ordenación solicitada.  El frontend envía:
      · order_by  ∈ {"price", "name"}
      · order_dir ∈ {"asc", "desc"}
    """
    if not order_by:
        return query  # sin ordenación

    mapping = {
        "price": Item.price_per_h,
        "name": Item.name,
        "id": Item.id,  # comodín por si acaso
    }
    column = mapping.get(order_by, Item.id)
    return query.order_by(asc(column) if order_dir == "asc" else desc(column))


# ─────────────────────────────── Lectura ────────────────────────────────────
def get_item(db: Session, item_id: int) -> Optional[Item]:
    """
    Obtiene un ítem por id con categorías **y todas sus imágenes** pre-cargadas.
    """
    return (
        db.query(Item)
        .options(joinedload(Item.categories), joinedload(Item.images))
        .filter(Item.id == item_id)
        .first()
    )


def _build_items_query(
    db: Session,
    *,
    name: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    available: Optional[bool] = None,
    categories: Optional[List[int]] = None,
    order_by: Optional[str] = None,
    order_dir: Optional[str] = None,
):
    """
    Crea la consulta base aplicando filtros dinámicos y la ordenación.
    """
    q = db.query(Item).options(joinedload(Item.categories), joinedload(Item.images))

    # ── filtros texto / rango precio / disponibilidad ──────────────────────
    if name:
        pattern = f"%{name}%"
        q = q.filter(or_(Item.name.ilike(pattern), Item.description.ilike(pattern)))

    if min_price is not None:
        q = q.filter(Item.price_per_h >= min_price)

    if max_price is not None:
        q = q.filter(Item.price_per_h <= max_price)

    if available is not None:
        q = q.filter(Item.available == available)

    # ── filtro por categorías (al menos una coincidente) ───────────────────
    if categories:
        q = q.filter(Item.categories.any(Category.id.in_(categories)))

    # ── ordenación ─────────────────────────────────────────────────────────
    return _apply_ordering(q, order_by, order_dir)


def get_items(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    *,
    name: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    available: Optional[bool] = None,
    categories: Optional[List[int]] = None,
    order_by: Optional[str] = None,
    order_dir: Optional[str] = None,
) -> Tuple[List[Item], int]:
    """
    Devuelve la lista paginada de ítems junto con el total de resultados
    antes de la paginación (para cabecera X-Total-Count).
    """
    q = _build_items_query(
        db,
        name=name,
        min_price=min_price,
        max_price=max_price,
        available=available,
        categories=categories,
        order_by=order_by,
        order_dir=order_dir,
    )
    total = q.count()
    items = q.offset(skip).limit(limit).all()
    return items, total


def get_items_by_owner(db: Session, owner_id: int) -> List[Item]:
    """
    Lista todos los ítems propiedad de *owner_id* con categorías e imágenes.
    """
    return (
        db.query(Item)
        .options(joinedload(Item.categories), joinedload(Item.images))
        .filter(Item.owner_id == owner_id)
        .all()
    )


# ─────────────────────────────── Escritura ──────────────────────────────────
def create_item(db: Session, item_in: ItemCreate, owner_id: int) -> Item:
    """
    Crea un ítem, vincula categorías e **inserta todas las imágenes**.
    """
    # la primera imagen se guarda también en el campo legacy `image_url`
    main = str(item_in.image_urls[0])

    db_item = Item(
        name=item_in.name,
        description=item_in.description,
        price_per_h=item_in.price_per_h,
        image_url=main,
        owner_id=owner_id,
    )

    # categorías
    if item_in.categories:
        db_item.categories = _get_categories_or_400(db, item_in.categories)

    # imágenes (tabla hija)
    db_item.images = [ItemImage(url=str(url)) for url in item_in.image_urls]

    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_item(db: Session, item: Item, item_in: ItemUpdate) -> Item:
    """
    Actualiza los campos presentes en *item_in* (PATCH).
    Si se envían nuevas `image_urls` se reemplaza la galería completa.
    """
    data = item_in.model_dump(exclude_unset=True, exclude={"categories", "image_urls"})
    for key, value in data.items():
        setattr(item, key, value)

    # categorías (si vienen)
    if item_in.categories is not None:
        item.categories = _get_categories_or_400(db, item_in.categories)

    # imágenes
    if item_in.image_urls is not None:
        item.image_url = str(item_in.image_urls[0])  # sync campo destacado
        item.images = [ItemImage(url=str(url)) for url in item_in.image_urls]

    db.commit()
    db.refresh(item)
    return item


def delete_item(db: Session, item: Item) -> None:
    """Elimina un ítem (y cascada sus imágenes)."""
    db.delete(item)
    db.commit()
