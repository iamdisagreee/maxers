from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select, update, desc, asc, func
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert

from app.users.models import User


class UserRepository:
    def __init__(
            self,
            postgres: AsyncSession
    ):
        self.postgres = postgres


    async def add_user(
            self,
            user_id: int,
            username: str,
            first_name: str,
            role: str,
            city: str
    ):
        await self.postgres.insert(User.values(
            user_id=user_id, username=username, first_name=first_name, role=role, city=city)
        )
        await self.postgres.commit()
