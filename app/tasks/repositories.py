from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select, update, desc, asc, func
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert

from .models import Task


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
            address: str,
    ):
        await self.postgres.execute(
            insert(Task)
            .values(needy=needy, points=points, category=category, name=name, description=description, address=address)
        )
        await self.postgres.commit()

    async def get_task_by_id(
            self,
            task_id: UUID
    ):
        return await self.postgres.scalar(
            select(Task)
            .where(Task.id == task_id)
        )

    async def update_task(
            self,
            task_id: UUID,
            status: str
    ):
        return await self.postgres.execute(
            update(Task)
            .values(status=status)
            .where(Task.id == task_id)
        )

    async def commit(self):
        await self.postgres.commit()