# app/main.py
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles          # 🆕

from app import models  # noqa: F401
from app.api import auth, items, rentals, categories, upload   # 🆕

app = FastAPI(title="rental-mvp")

# Routers
app.include_router(auth.router,       prefix="/api/auth",      tags=["auth"])
app.include_router(items.router,      prefix="/api/items",     tags=["items"])
app.include_router(rentals.router,    prefix="/api/rentals",   tags=["rentals"])
app.include_router(categories.router, prefix="/api/categories", tags=["categories"])
app.include_router(upload.router,     prefix="/api/upload",    tags=["upload"])  # 🆕

# ► archivos subidos accesibles en /uploads/…
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")         # 🆕
