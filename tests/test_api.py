import datetime
from urllib.parse import parse_qs, urlparse

from fastapi import status


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------

def _signup(client, username="alice", email="alice@example.com", password="secret"):
    return client.post(
        "/api/auth/signup",
        json={"username": username, "email": email, "password": password},
    )


def _login(client, username="alice", password="secret"):
    res = client.post(
        "/api/auth/token",
        data={"username": username, "password": password},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    return res.json()["access_token"]


# ---------------------------------------------------------------------------
# auth
# ---------------------------------------------------------------------------

def test_signup_login(client):
    r = _signup(client)
    assert r.status_code == status.HTTP_201_CREATED
    data = r.json()
    assert data["username"] == "alice"
    assert data["email"] == "alice@example.com"

    token = _login(client)
    assert token, "No se devolvió access_token"


# ---------------------------------------------------------------------------
# items + rentals flow
# ---------------------------------------------------------------------------

def test_item_crud_and_rental_flow(client):
    # usuarios
    _signup(client, "alice", "alice@example.com", "pwd")
    token_alice = _login(client, "alice", "pwd")
    auth_alice = {"Authorization": f"Bearer {token_alice}"}

    _signup(client, "bob", "bob@example.com", "pwd")
    token_bob = _login(client, "bob", "pwd")
    auth_bob = {"Authorization": f"Bearer {token_bob}"}

    # ► Alice crea un ítem
    r = client.post(
        "/api/items/",
        json={"name": "Taladro Bosch", "description": "800 W", "price_per_h": 4.5},
        headers=auth_alice,
    )
    assert r.status_code == status.HTTP_201_CREATED
    item_id = r.json()["id"]

    # ► Listado público incluye el ítem
    r = client.get("/api/items/")
    assert any(it["id"] == item_id for it in r.json())

    # ► Bob alquila el ítem
    start = datetime.datetime.utcnow()
    end = start + datetime.timedelta(hours=2)
    r = client.post(
        "/api/rentals/",
        json={"item_id": item_id, "start_at": start.isoformat(), "end_at": end.isoformat()},
        headers=auth_bob,
    )
    assert r.status_code == status.HTTP_201_CREATED
    rental = r.json()
    assert rental["deposit"] == round(2 * 4.5 * 1.2, 2)

    # ► Devolución
    r = client.post(f"/api/rentals/{rental['id']}/return", headers=auth_bob)
    assert r.status_code == status.HTTP_200_OK
    assert r.json()["returned"] is True


# ---------------------------------------------------------------------------
# PUT completo
# ---------------------------------------------------------------------------

def test_put_full_update_item(client):
    _signup(client, "neo", "n@e.o", "pwd")
    token = _login(client, "neo", "pwd")
    auth = {"Authorization": f"Bearer {token}"}

    # crea
    r = client.post(
        "/api/items/",
        json={"name": "Martillo", "description": "mango madera", "price_per_h": 3},
        headers=auth,
    )
    item_id = r.json()["id"]

    # reemplaza todos los campos
    r = client.put(
        f"/api/items/{item_id}",
        json={"name": "Martillo PRO", "description": "fibra", "price_per_h": 4},
        headers=auth,
    )
    assert r.status_code == status.HTTP_200_OK
    data = r.json()
    assert data["name"] == "Martillo PRO"
    assert data["price_per_h"] == 4


# ---------------------------------------------------------------------------
# nuevas coberturas
# ---------------------------------------------------------------------------

def test_rental_end_before_start_validation(client):
    """El esquema debe rechazar end_at ≤ start_at (422 Unprocessable Entity)."""
    _signup(client, "carl", "c@r.l", "pwd")
    token = _login(client, "carl", "pwd")
    auth = {"Authorization": f"Bearer {token}"}

    # necesita un ítem primero
    r = client.post("/api/items/", json={"name": "Sierra", "price_per_h": 2}, headers=auth)
    item_id = r.json()["id"]

    now = datetime.datetime.utcnow()
    r = client.post(
        "/api/rentals/",
        json={"item_id": item_id, "start_at": now.isoformat(), "end_at": now.isoformat()},
        headers=auth,
    )
    assert r.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_items_pagination_headers(client):
    """Verifica `X-Total-Count` y cabecera Link paginada."""
    _signup(client, "pag", "p@g.e", "pwd")
    token = _login(client, "pag", "pwd")
    auth = {"Authorization": f"Bearer {token}"}

    # crea 3 ítems
    for i in range(3):
        client.post(
            "/api/items/",
            json={"name": f"Item{i}", "price_per_h": 1 + i},
            headers=auth,
        )

    # página 1 (2 resultados)
    r = client.get("/api/items/?skip=0&limit=2")
    assert r.status_code == 200
    assert len(r.json()) == 2
    assert r.headers["X-Total-Count"] == "3"
    link = r.headers.get("Link")
    assert link and 'rel="next"' in link

    # parseamos la URL next
    next_url = link.split(";")[0].strip("<>")
    qs = parse_qs(urlparse(next_url).query)
    assert qs["skip"] == ["2"]
    assert qs["limit"] == ["2"]

    # página 2
    r2 = client.get(next_url)
    assert r2.status_code == 200
    assert len(r2.json()) == 1
    assert 'rel="prev"' in r2.headers.get("Link", "")
