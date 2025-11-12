from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select, update, desc, asc, func
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert

from .models import BlacklistTask

class BlacklistTaskRepository:
    def __init__(
            self,
            postgres: AsyncSession
    ):
        self.postgres = postgres

    async def insert_blacklist_task(
            self,
            user_id: int,
            task_id: UUID
    ):
        await self.postgres.execute(
            insert(BlacklistTask)
            .values(user_id=user_id, task_id=task_id)
        )
        await self.postgres.commit()
