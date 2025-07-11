# app/schemas/rental.py
from datetime import datetime
from pydantic import BaseModel, field_validator


class RentalBase(BaseModel):
    item_id: int
    start_at: datetime
    end_at: datetime


class RentalCreate(RentalBase):
    """
    Al crear un alquiler nos aseguramos de que la hora de fin sea
    posterior a la hora de inicio.
    """

    @field_validator("end_at")
    def end_must_be_after_start(cls, v: datetime, info):
        start = info.data.get("start_at")
        if start and v <= start:
            raise ValueError("end_at debe ser posterior a start_at")
        return v

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "item_id": 42,
                    "start_at": "2025-01-01T10:00:00Z",
                    "end_at": "2025-01-01T12:00:00Z",
                }
            ]
        }
    }


class RentalOut(RentalBase):
    id: int
    renter_id: int
    deposit: float
    returned: bool

    class Config:
        from_attributes = True
