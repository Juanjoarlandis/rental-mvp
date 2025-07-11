"""Initial tables for rental-mvp

Revision ID: 20250709_0001
Revises: 
Create Date: 2025-07-09 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

# Identificadores de Alembic
revision = "20250709_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ---------- users ----------
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("username", sa.String(), nullable=False, unique=True, index=True),
        sa.Column("email", sa.String(), nullable=False, unique=True, index=True),
        sa.Column("hashed_pw", sa.String(), nullable=False),
    )

    # ---------- items ----------
    op.create_table(
        "items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False, index=True),
        sa.Column("description", sa.String()),
        sa.Column("price_per_h", sa.Float(), nullable=False),
        sa.Column("owner_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("available", sa.Boolean(), server_default=sa.sql.false()),
    )

    # ---------- rentals ----------
    op.create_table(
        "rentals",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("item_id", sa.Integer(), sa.ForeignKey("items.id"), nullable=False),
        sa.Column("renter_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("start_at", sa.DateTime(), nullable=False),
        sa.Column("end_at", sa.DateTime(), nullable=False),
        sa.Column("deposit", sa.Float(), nullable=False),
        sa.Column("returned", sa.Boolean(), server_default=sa.sql.false()),
    )


def downgrade() -> None:
    op.drop_table("rentals")
    op.drop_table("items")
    op.drop_table("users")
