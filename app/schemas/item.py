# app/schemas/item.py
from __future__ import annotations
from typing import List, Optional

from pydantic import BaseModel, Field, PositiveFloat

from .category import CategoryOut


# ─────────────────────────── Base ──────────────────────────────────────────
class ItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    description: Optional[str] = None
    price_per_h: PositiveFloat
    image_url: Optional[str] = Field(
        None,
        pattern=r"^https?://",          # validación sencilla de URL pública
        description="URL pública de la imagen",
    )


# ──────────────────────── Crear (POST) ─────────────────────────────────────
class ItemCreate(ItemBase):
    categories: Optional[List[int]] = Field(
        default=None,
        description="IDs de categorías a asociar",
        examples=[[1, 2]],
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "Taladro Bosch",
                    "description": "800 W",
                    "price_per_h": 4.5,
                    "image_url": "https://…/foto.jpg",
                    "categories": [1, 2],
                }
            ]
        }
    }


# ─────────────────────── Actualizar (PATCH) ────────────────────────────────
class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=80)
    description: Optional[str] = None
    price_per_h: Optional[PositiveFloat] = None
    image_url: Optional[str] = Field(
        None,
        pattern=r"^https?://",
        description="URL pública de la imagen",
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

    class Config:
        from_attributes = True
