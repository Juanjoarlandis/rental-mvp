"""
Fixtures de prueba para FastAPI.

Para evitar colisiones entre tests, cada test recibe su propia base SQLite
en memoria.  Usamos un StaticPool para que todas las peticiones que se
ejecutan dentro del mismo test compartan la misma conexión.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.models.database import Base
from app.deps import get_db


@pytest.fixture()
def db():
    """
    Crea una base de datos SQLite en memoria exclusiva para el test
    y devuelve una sesión SQLAlchemy conectada a ella.
    """
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,           # <<— comparte conexión en el test
    )
    Base.metadata.create_all(bind=engine)

    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )

    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(db):
    """
    Devuelve un TestClient que usa la sesión `db` anterior para todas
    las dependencias `get_db` dentro de la app.
    """

    def override_get_db():
        try:
            yield db
        finally:
            pass

    # Sobrescribimos la dependencia
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c
