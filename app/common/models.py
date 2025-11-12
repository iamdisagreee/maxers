from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  Integer, DateTime, String, func, ForeignKey, Float, Uuid
from sqlalchemy.sql import text

from ..core.postgres import BaseSchema

class BlacklistTask(BaseSchema):
    __tablename__ = 'blacklist_tasks'
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id', ondelete='cascade'), primary_key=True)
    task_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey('tasks.id', ondelete='cascade'), primary_key=True)
    created_at: Mapped[int] = mapped_column(DateTime, server_default=func.now(), nullable=False)

