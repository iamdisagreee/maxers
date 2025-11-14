from datetime import datetime
from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  Integer, DateTime, String, func, ForeignKey, Float
from sqlalchemy.sql import text

from ..common import models
from ..core.postgres import BaseSchema

class User(BaseSchema):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    city: Mapped[str] = mapped_column(String(50), nullable=False)
    url: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now(),  nullable=False)

    activity: Mapped['Activity'] = relationship(back_populates='user')
    blacklist_task: Mapped[List['models.BlacklistTask']] = relationship(back_populates='user')

class Activity(BaseSchema):
    __tablename__ = 'activities'

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id', ondelete='cascade'), primary_key=True)
    rating: Mapped[float] = mapped_column(Float, nullable=False)
    completed_tasks: Mapped[int] = mapped_column(Integer, server_default=text('0'), nullable=False)
    count_reports: Mapped[int] = mapped_column(Integer, server_default=text('0'), nullable=False)

    user: Mapped['User'] = relationship(back_populates='activity')