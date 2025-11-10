from uuid import UUID

import aiohttp
from fastapi import UploadFile, HTTPException, status
from fastapi.responses import JSONResponse

from .repositories import TaskRepository

class TaskService:
    def __init__(
            self,
            task_repo: TaskRepository
    ):
        self.task_repo = task_repo

    async def add_task(
            self,
            needy: int,
            category: str,
            name: str,
            description: str,
            address: str,
    ):
        points = 1
        await self.task_repo.add_task(
            needy=needy,
            points=points,
            category=category,
            name=name,
            description=description,
            address=address,
        )

        return {'detail': 'Task successfully created'}

    async def get_task(
            self,
            task_id: UUID
    ):
        task = await self.task_repo.get_task_by_id(task_id=task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= [
                    {
                        'msg': 'No task with this id'
                    }
                ]
            )
        return task

    async def update_task(
            self,
            task_id: UUID,
            status: str
    ):
        update = await self.task_repo.update_task(
            task_id=task_id,
            status=status
        )
        if not update.rowcount:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= [
                    {
                        'msg': 'No task with this id'
                    }
                ]
            )
        await self.task_repo.commit()
        
        return {'detail': 'Task successfully updated'}
