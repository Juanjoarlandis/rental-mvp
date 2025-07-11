# app/crud/rental.py
from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime
from typing import List

from sqlalchemy.orm import Session

from app.models.models import Item, Rental
from app.schemas.rental import RentalCreate


def get_rental(db: Session, rental_id: int) -> Rental | None:
    return db.query(Rental).filter(Rental.id == rental_id).first()


def get_rentals_by_user(db: Session, renter_id: int) -> List[Rental]:
    return db.query(Rental).filter(Rental.renter_id == renter_id).all()


def create_rental(db: Session, renter_id: int, rent_in: RentalCreate) -> Rental:
    """Crea un alquiler y calcula el depósito como 120 % del coste estimado,
    redondeado a 2 decimales para evitar errores de coma flotante."""
    item = db.query(Item).get(rent_in.item_id)  # legacy API, suficiente aquí
    hours = (rent_in.end_at - rent_in.start_at).total_seconds() / 3600
    estimated = hours * item.price_per_h

    deposit = float(                      # guardamos como float en la BD
        Decimal(estimated * 1.2).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    )

    db_rental = Rental(
        renter_id=renter_id,
        deposit=deposit,
        returned=False,
        **rent_in.model_dump(),           # pydantic v2
    )

    db.add(db_rental)
    item.available = False
    db.commit()
    db.refresh(db_rental)
    return db_rental


def mark_returned(db: Session, rental: Rental) -> Rental:
    """Marca el alquiler como devuelto y vuelve a poner el ítem disponible."""
    rental.returned = True
    rental.item.available = True
    db.commit()
    db.refresh(rental)
    return rental
