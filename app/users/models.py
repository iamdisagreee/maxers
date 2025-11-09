from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  Integer, DateTime, String, func, ForeignKey, Float
from sqlalchemy.sql import text

from ..core.postgres import BaseSchema

class User(BaseSchema):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(50))
    first_name: Mapped[str] = mapped_column(String(50))
    role: Mapped[str] = mapped_column(String(50))
    city: Mapped[str] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    activity: Mapped['Activity'] = relationship(back_populates='user')

class Activity(BaseSchema):
    __tablename__ = 'activities'

    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('users.id', ondelete='cascade'), primary_key=True)
    rating: Mapped[float] = mapped_column(Float)
    completed_tasks: Mapped[int] = mapped_column(Integer)

    user: Mapped['User'] = relationship(back_populates='activity')