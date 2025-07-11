# app/crud/category.py
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.models import Category
from app.schemas.category import CategoryCreate


def get_category(db: Session, category_id: int) -> Optional[Category]:
    return db.query(Category).filter(Category.id == category_id).first()


def get_categories(db: Session) -> List[Category]:
    return db.query(Category).order_by(Category.name).all()


def create_category(db: Session, cat_in: CategoryCreate) -> Category:
    db_cat = Category(**cat_in.model_dump())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat
