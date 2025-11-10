from uuid import UUID
from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  Integer, DateTime, String, func, ForeignKey, Float, Uuid
from sqlalchemy.sql import text

from ..core.postgres import BaseSchema


class Task(BaseSchema):
    __tablename__ = 'tasks'

    id: Mapped[UUID] = mapped_column(Uuid, server_default=text("gen_random_uuid()"), primary_key=True)
    status: Mapped[str] = mapped_column(String(50), default='Pending', nullable=False)
    needy: Mapped[int] = mapped_column(Integer, nullable=False)
    helper: Mapped[int] = mapped_column(Integer, nullable=True)
    points: Mapped[int] = mapped_column(Integer, nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=False)
    address: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    finished_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

