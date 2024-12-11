"""empty message

Revision ID: 761616f452b0
Revises: 
Create Date: 2024-12-09 23:42:30.539707

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '761616f452b0'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('anda_user',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('full_name', sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=50), nullable=False),
    sa.Column('image_url', sa.String(length=250), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.Column('is_admin', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('user_id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('book',
    sa.Column('book_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('author', sa.String(length=100), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('book_id')
    )
    op.create_table('location',
    sa.Column('location_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('capacity', sa.Integer(), nullable=False),
    sa.Column('address', sa.String(length=200), nullable=False),
    sa.Column('image_url', sa.String(length=250), nullable=True),
    sa.Column('is_active', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('location_id')
    )
    op.create_table('schedule',
    sa.Column('schedule_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('book_id', sa.Integer(), nullable=True),
    sa.Column('location_id', sa.Integer(), nullable=True),
    sa.Column('start_time', sa.DateTime(), nullable=False),
    sa.Column('end_time', sa.DateTime(), nullable=False),
    sa.Column('status', sa.String(length=50), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['book_id'], ['book.book_id'], ),
    sa.ForeignKeyConstraint(['location_id'], ['location.location_id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['anda_user.user_id'], ),
    sa.PrimaryKeyConstraint('schedule_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('schedule')
    op.drop_table('location')
    op.drop_table('book')
    op.drop_table('anda_user')
    # ### end Alembic commands ###
