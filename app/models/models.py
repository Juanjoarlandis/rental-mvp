from __future__ import annotations

import datetime
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Table,
)
from sqlalchemy.orm import relationship

from .database import Base

item_categories = Table(
    "item_categories",
    Base.metadata,
    Column("item_id", Integer, ForeignKey("items.id", ondelete="CASCADE"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_pw = Column(String, nullable=False)

    items = relationship("Item", back_populates="owner", cascade="all, delete-orphan")
    rentals = relationship("Rental", back_populates="renter", cascade="all, delete-orphan")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True, nullable=False)

    items = relationship("Item", secondary=item_categories, back_populates="categories")


class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String)
    price_per_h = Column(Float, nullable=False)

    image_url = Column(String, nullable=True)          # 🆕

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="items")

    available = Column(Boolean, default=True)

    # relación n-n con categorías   ←  lazy por defecto (“select”): SIN JOIN
    categories = relationship(
        "Category",
        secondary=item_categories,
        back_populates="items",
    )


class Rental(Base):
    __tablename__ = "rentals"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    renter_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    start_at = Column(DateTime, default=datetime.datetime.utcnow)
    end_at = Column(DateTime)

    deposit = Column(Float, nullable=False)
    returned = Column(Boolean, default=False)

    item = relationship("Item")
    renter = relationship("User", back_populates="rentals")
