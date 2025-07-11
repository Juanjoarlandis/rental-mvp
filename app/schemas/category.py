# app/schemas/category.py
from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)


class CategoryCreate(CategoryBase):
    """Crear categoría (solo nombre)."""
    pass


class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True
