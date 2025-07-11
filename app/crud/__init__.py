"""
Al importar ``app.crud`` re-exportamos helpers de todos los sub-módulos
para poder usarlos como ``crud.algo`` sin tener que encadenar paquetes.
"""

# ───────────────────────────── users ──────────────────────────────────────
from .user import (           # noqa: F401  (re-export)
    get_user_by_username,
    get_user_by_email,        # 🆕
    create_user,
    verify_password,
)

# ───────────────────────────── items ──────────────────────────────────────
from .item import (           # noqa: F401
    get_item,
    get_items,
    get_items_by_owner,
    create_item,
    update_item,
    delete_item,
)

# ─────────────────────────── rentals ──────────────────────────────────────
from .rental import (         # noqa: F401
    get_rental,
    get_rentals_by_user,
    create_rental,
    mark_returned,
)

# ───────────────────────── categories ─────────────────────────────────────
from .category import (       # noqa: F401
    get_category,
    get_categories,
    create_category,
)

__all__: list[str] = [
    # users
    "get_user_by_username",
    "get_user_by_email",      # 🆕
    "create_user",
    "verify_password",
    # items
    "get_item",
    "get_items",
    "get_items_by_owner",
    "create_item",
    "update_item",
    "delete_item",
    # rentals
    "get_rental",
    "get_rentals_by_user",
    "create_rental",
    "mark_returned",
    # categories
    "get_category",
    "get_categories",
    "create_category",
]
