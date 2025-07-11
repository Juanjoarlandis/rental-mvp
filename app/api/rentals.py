# app/api/rentals.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app import crud, schemas
from app.deps import get_db, get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.RentalOut, status_code=status.HTTP_201_CREATED)
def rent_item(rent_in: schemas.RentalCreate,
              db: Session = Depends(get_db),
              current_user=Depends(get_current_user)):
    # comprueba que el ítem está libre
    item = crud.get_item(db, rent_in.item_id)
    if not item or not item.available:
        raise HTTPException(400, "Item no disponible")
    return crud.create_rental(db, current_user.id, rent_in)

@router.get("/me", response_model=List[schemas.RentalOut])
def read_my_rentals(db: Session = Depends(get_db),
                    current_user=Depends(get_current_user)):
    return crud.get_rentals_by_user(db, current_user.id)

@router.post("/{rental_id}/return", response_model=schemas.RentalOut)
def return_item(rental_id: int,
                db: Session = Depends(get_db),
                current_user=Depends(get_current_user)):
    rental = crud.get_rental(db, rental_id)
    if not rental or rental.renter_id != current_user.id:
        raise HTTPException(404, "Alquiler no encontrado")
    return crud.mark_returned(db, rental)
