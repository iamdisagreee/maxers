from uuid import UUID
from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  Integer, DateTime, String, func, ForeignKey, Float, Uuid
from sqlalchemy.sql import text

from ..core.postgres import BaseSchema
from ..users import models as user_models
from ..tasks import models as task_models

class BlacklistTask(BaseSchema):
    __tablename__ = 'blacklist_tasks'
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id', ondelete='cascade'), primary_key=True)
    task_id: Mapped[UUID] = mapped_column(Uuid, ForeignKey('tasks.id', ondelete='cascade'), primary_key=True)
    created_at: Mapped[int] = mapped_column(DateTime, default=datetime.now(), nullable=False)

    user: Mapped['user_models.User'] = relationship(back_populates='blacklist_task')
    task: Mapped['task_models.Task'] = relationship(back_populates='blacklist_task')
