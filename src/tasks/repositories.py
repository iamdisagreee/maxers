from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select, update, desc, asc, func, or_, and_
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert

from .models import Task
from ..common.models import BlacklistTask


class TaskRepository:
    def __init__(
            self,
            postgres: AsyncSession
    ):
        self.postgres = postgres

    async def add_task(
            self,
            needy: int,
            points: int,
            category: str,
            name: str,
            description: str,
            city: str,
            address: str,
    ):
        await self.postgres.execute(
            insert(Task)
            .values(needy=needy, points=points, category=category,
                    name=name, description=description, city=city,  address=address)
        )
        await self.postgres.commit()

    async def get_all_tasks_by_user(
            self,
            user_id: int,
            limit: int,
            offset: int
    ):
        return await self.postgres.scalars(
            select(Task)
            .outerjoin(
                BlacklistTask,
                and_(
                    Task.id == BlacklistTask.task_id,
                    BlacklistTask.user_id == user_id
                )
            )
            .where(
                BlacklistTask.user_id.is_(None),
            )
            .limit(limit)
            .offset(offset)
            .order_by(Task.created_at)
        )

    async def get_all_tasks_by_status(
            self,
            status: str,
            city: str,
            limit: int,
            offset: int
    ):
        return await self.postgres.scalars(
            select(Task)
            .where(
                Task.status == status,
                Task.city == city
            )
            .limit(limit)
            .offset(offset)
            .order_by(Task.created_at)
        )

    async def get_task_by_id(
            self,
            user_id: int,
            task_id: UUID
    ):
        return await self.postgres.scalar(
            select(Task)
            .where(
                Task.id == task_id,
                or_(Task.helper == user_id, Task.needy == user_id)
            )
        )

    async def update_task(
            self,
            user_id: int,
            task_id: UUID,
            to_update: dict[str, Any]
    ):
        return await self.postgres.execute(
            update(Task)
            .values(**to_update)
            .where(
                Task.id == task_id,
                or_(Task.helper == user_id, Task.needy == user_id)
            )
            .returning(Task)
        )

    async def commit(self):
        await self.postgres.commit()

    async def rollback(self):
        await self.postgres.rollback()