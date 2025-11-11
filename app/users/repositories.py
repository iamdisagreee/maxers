from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select, update, desc, asc, func
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert

from app.users.models import User, Activity


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
        await self.postgres.execute(
            insert (User)
            .values(id=user_id, username=username, first_name=first_name, role=role, city=city)
        )
        await self.postgres.commit()


    async def initialization_activity(
            self,
            user_id: int,
            rating: float,
    ):
        await self.postgres.execute(
            insert(Activity)
            .values(user_id=user_id, rating=rating)
        )
        await self.postgres.commit()

    async def get_user_by_id(
            self,
            user_id: int
    ):
        return await self.postgres.scalar(
            select(User)
            .where(User.id == user_id)
            .options(selectinload(User.activity))
        )

    async def update_activity(
            self,
            user_id: int,
            role: str,
            add_points: int
    ):
        return await self.postgres.execute(
            update(Activity)
            .values(
                rating=Activity.points + add_points if role == 'Helper' else (Activity.points + add_points) % 5,
                completed_tasks=Activity.completed_tasks + 1
            )
            .where(Activity.user_id == user_id)
        )

    async def commit(self):
        await self.postgres.commit()