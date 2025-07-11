# app/models/__init__.py
"""
Al importar `app.models` se registran todos los modelos en `Base.metadata`.
"""
from .models import User, Category, Item, Rental  # noqa: F401
