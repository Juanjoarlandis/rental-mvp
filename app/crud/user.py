# app/crud/user.py
from __future__ import annotations

import bcrypt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.models.models import User
from app.schemas.user import UserCreate

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ───────────────────────── helpers privados ──────────────────────────────


def _hash_password(pwd: str) -> str:
    """Devuelve el hash seguro de *pwd* usando passlib/bcrypt."""
    return pwd_context.hash(pwd)


# ────────────────────────────── Lectura ───────────────────────────────────


def get_user_by_username(db: Session, username: str) -> User | None:
    """Busca un usuario por *username* (o None si no existe)."""
    return db.query(User).filter(User.username == username).first()


def get_user_by_email(db: Session, email: str) -> User | None:
    """Busca un usuario por email (o None si no existe)."""
    return db.query(User).filter(User.email == email).first()


# ───────────────────────────── Escritura ──────────────────────────────────


def create_user(db: Session, user_in: UserCreate) -> User:
    """
    Crea un nuevo usuario con contraseña hasheada y lo devuelve.
    Lanza IntegrityError si el username/email ya existen.
    """
    db_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_pw=_hash_password(user_in.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


# ──────────────────────── Utilidades varias ──────────────────────────────


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Comprueba que *plain_password* coincide con el hash almacenado.
    Se usa bcrypt directamente para evitar dependencias implícitas.
    """
    try:
        return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())
    except Exception:  # noqa: BLE001
        # bcrypt lanza ValueError si el hash no es válido
        return False
