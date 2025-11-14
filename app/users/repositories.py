from urllib.parse import uses_relative

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
            last_name: str,
            role: str,
            city: str,
            url: str
    ):
        await self.postgres.execute(
            insert (User)
            .values(id=user_id, username=username, first_name=first_name,
                    last_name=last_name, role=role, city=city, url=url)
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

    async def get_all_users_by_role(
            self,
            role: str,
            limit: int,
    ):
        return await self.postgres.scalars(
            select(User)
            .join(Activity, User.id == Activity.user_id)
            .where(User.role == role)
            .options(selectinload(User.activity))
            .order_by(desc(Activity.rating))
            .limit(limit)
        )

    async def get_user_rank_and_data(
            self,
            user_id: int,
            role: str
    ):
        rank_window = func.rank().over(
            order_by=desc(Activity.rating)
        ).label('place')
        subquery = (
            select(Activity.user_id.label('id'), rank_window)
            .join(User, User.id == Activity.user_id)
            .where(User.role == role)
            .subquery()
        )
        stmt = (
            select(User, subquery.c.place)
            .join(subquery, User.id == subquery.c.id)
            .where(User.id == user_id)
            .options(selectinload(User.activity))
        )
        return (await self.postgres.execute(stmt)).first()

    async def get_user_by_id(
            self,
            user_id: int
    ):
        return await self.postgres.scalar(
            select(User)
            .where(User.id == user_id)
            .options(selectinload(User.activity))
        )

    async def get_user_by_id_needy(
            self,
            user_id: int,
            role: str
    ):
        return await self.postgres.scalar(
            select(User)
            .where(User.id == user_id, User.role == 'Needy')
        )

    async def get_user_by_id_user_helper(
            self,
            user_id: int,
    ):
        return await self.postgres.scalar(
            select(User)
            .where(User.id == user_id, User.role == 'Helper')
        )

    async def update_rating(
            self,
            user_id: int,
            role: str,
            add_points: int
    ):
        return await self.postgres.execute(
            update(Activity)
            .values(
                rating=Activity.rating + add_points,
                completed_tasks=Activity.completed_tasks + 1
            )
            .where(Activity.user_id == user_id)
            .returning(Activity)
        )

    async def commit(self):
        await self.postgres.commit()

    async def update_user(
            self,
            user_id: int,
            city: str
    ):
        return await self.postgres.execute(
            update(User)
            .values(city=city)
            .where(User.id == user_id)
            .returning(User)
        )

    async def update_count_reports(
            self,
            user_id: int
    ):
        return await self.postgres.execute(
            update(Activity)
            .values(count_reports=Activity.count_reports + 1)
            .where(Activity.user_id == user_id)
            .returning(Activity)
        )