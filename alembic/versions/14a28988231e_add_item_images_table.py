"""add item_images table

Revision ID: 14a28988231e
Revises: da75d24ced9e
Create Date: 2025-07-11 13:35:13.943474

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '14a28988231e'
down_revision: Union[str, Sequence[str], None] = 'da75d24ced9e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
