import uuid
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  Integer, DateTime, String, func, ForeignKey, Float, Uuid
from sqlalchemy.sql import text

from ..core.postgres import BaseSchema


class Task(BaseSchema):
    __tablename__ = 'tasks'

    id: Mapped[uuid] = mapped_column(Uuid, primary_key=True)
    needy: Mapped[int] = mapped_column(Integer)
    helper: Mapped[int] = mapped_column(Integer)
    points: Mapped[int] = mapped_column(Integer)
    category: Mapped[str] = mapped_column(String(50))
    name: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(String)
    address: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    finished_at: Mapped[datetime] = mapped_column(DateTime)

