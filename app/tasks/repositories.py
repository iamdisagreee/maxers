from datetime import datetime
from typing import Optional, Dict, Any
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
            to_update: dict[str, Any]
    ):
        return await self.postgres.execute(
            update(Task)
            .values(**to_update)
            .where(Task.id == task_id)
            .returning(Task)
        )

    async def commit(self):
        await self.postgres.commit()

    async def rollback(self):
        await self.postgres.rollback()