from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID

import aiohttp
from fastapi import UploadFile, HTTPException, status
from fastapi.responses import JSONResponse

from .repositories import TaskRepository
from ..users.repositories import UserRepository


class TaskService:
    def __init__(
            self,
            task_repo: TaskRepository,
            user_repo: UserRepository
    ):
        self.task_repo = task_repo
        self.user_repo = user_repo

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

    async def update_activity(self):
        pass

    async def update_task(
            self,
            task_id: UUID,
            status: str,
            helper: int,
            role: str,
            task_points: int,
            review_points: int,
            reason_reject: str
    ):
        to_update: Dict[str, Any] = {'status': status}
        add_points = 0

        match status:
            case 'Pending':
                to_update.update({'helper': None, 'finished_at': None})
            case 'Process':
                to_update.update({'helper': helper, 'finished_at': None})
            case 'Cancelled':
                if role == 'Helper':
                    if reason_reject == 'Physical':
                        add_points = 0
                    elif reason_reject == 'Plans':
                        add_points = -task_points
                elif role == 'Needy':
                    if reason_reject in ('Physical', 'Search'):
                        add_points = 0
                    elif reason_reject == 'Plans':
                        add_points = -0.05
                to_update.update({'finished_at': datetime.now()})
            case 'Completed':
                if role == 'Helper':
                    add_points = task_points + review_points
                elif role == 'Needy':
                    add_points = 0.01 + review_points * 0.02
                to_update.update({'finished_at': datetime.now()})

        update_task = await self.task_repo.update_task(
            task_id=task_id,
            to_update=to_update
        )
        await self.task_repo.commit()
        if not update_task.rowcount:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= [
                    {
                        'msg': 'No task with this id'
                    }
                ]
            )

        if status in ('Cancelled', 'Completed'):
            task_scalar = update_task.scalar()
            helper_id = task_scalar.helper_id
            needy_id = task_scalar.needy_id

            for user_id, role in ((helper_id, 'Helper'), (needy_id, 'Needy')):
                update_activity = await self.user_repo.update_activity(
                    user_id=user_id,
                    role=role,
                    add_points=add_points
                )
                await self.user_repo.commit()

                if not update_activity.rowcount:
                    await self.task_repo.rollback()
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail= [
                            {
                                'msg': 'No helper or needy with this id in task'
                            }
                        ]
                    )

        return {'detail': 'Task and activity successfully updated'}
