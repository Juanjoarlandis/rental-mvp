from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "da75d24ced9e"
down_revision = "20250709_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "items",
        sa.Column("image_url", sa.String(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("items", "image_url")
