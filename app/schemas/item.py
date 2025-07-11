from __future__ import annotations
from typing import List, Optional

from pydantic import BaseModel, Field, PositiveFloat, HttpUrl

from .category import CategoryOut


# ─────────────────────────── Base ──────────────────────────────────────────
class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    description: Optional[str] = None
    price_per_h: PositiveFloat


# ─────────────────────────── Crear ─────────────────────────────────────────
class ItemCreate(ItemBase):
    image_urls: List[HttpUrl] = Field(..., min_length=1, max_length=6)
    categories: Optional[List[int]] = Field(
        default=None,
        description="IDs de categorías a asociar",
        examples=[[1, 2]],
    )


# ─────────────────────── Actualizar (PATCH) ────────────────────────────────
class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=80)
    description: Optional[str] = None
    price_per_h: Optional[PositiveFloat] = None
    image_urls: Optional[List[HttpUrl]] = Field(
        default=None, min_length=1, max_length=6
    )
    categories: Optional[List[int]] = Field(
        default=None, description="Lista completa de IDs (reemplaza)"
    )

    model_config = {"extra": "forbid"}


# ─────────────────────────── Salida ────────────────────────────────────────
class ItemOut(ItemBase):
    id: int
    owner_id: int
    available: bool
    categories: List[CategoryOut]
    image_urls: List[HttpUrl]                        # ← NUEVO
    # campo legacy para no romper clientes antiguos
    image_url: Optional[HttpUrl] = None

    class Config:
        from_attributes = True
