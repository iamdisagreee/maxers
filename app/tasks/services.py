from datetime import datetime
from resource import RLIMIT_MEMLOCK
from typing import Optional, Dict, Any
from uuid import UUID

import aiohttp
from fastapi import UploadFile, HTTPException, status
from fastapi.responses import JSONResponse

from .repositories import TaskRepository
from ..common.repositories import BlacklistTaskRepository
from ..users.repositories import UserRepository


class TaskService:
    def __init__(
            self,
            task_repo: TaskRepository,
            user_repo: UserRepository,
            blck_task_repo: BlacklistTaskRepository
    ):
        self.task_repo = task_repo
        self.user_repo = user_repo
        self.blck_task_repo = blck_task_repo

    async def add_task(
            self,
            user_id: int,
            role: str,
            category: str,
            name: str,
            description: str,
            address: str,
    ):
        if role == 'Helper':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=[
                    {
                        'msg': "This method can`t be use by helper"
                    }
                ]
            )

        is_user_needy = await self.user_repo.get_user_by_id_needy(
            user_id=user_id,
            role=role
        )

        if not is_user_needy:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=[
                    {
                        'msg': "No access to create tasks"
                    }
                ]
        )

        points = 5
        await self.task_repo.add_task(
            needy=user_id,
            points=points,
            category=category,
            name=name,
            description=description,
            address=address,
        )

        return {'detail': 'Task successfully created'}

    async def get_all_tasks(
            self,
            user_id: int,
            type_list: str,
            page: int
    ):
        limit = 10
        offset = (page - 1) * limit
        if type_list == 'user':
            all_tasks = await self.task_repo.get_all_tasks_by_user(
                user_id=user_id,
                limit=limit,
                offset=offset
            )
        else:
            all_tasks = await self.task_repo.get_all_tasks_by_status(
                status=type_list.capitalize(),
                limit=limit,
                offset=offset
            )

        return all_tasks

    async def get_task(
            self,
            user_id: int,
            task_id: UUID
    ):

        task = await self.task_repo.get_task_by_id(
            user_id=user_id,
            task_id=task_id,
        )
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= [
                    {
                        'msg': 'No task with this id / No access to view'
                    }
                ]
            )
        # print(task.created_at)
        return task

    async def update_task(
            self,
            user_id: int,
            role: str,
            task_id: UUID,
            user_status: str,
            helper: int,
            task_points: int,
            review_points: int,
            reason_reject: str
    ):
        to_update: Dict[str, Any] = {'status': user_status}
        add_points_helper = 0
        add_points_needy = 0
        task_points = task_points  if task_points else 0
        review_points = review_points if review_points else 0
        forbidden_helper = HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=[
                            {
                                'msg': "This status can`t be set by helper"
                            }
                        ]
                    )

        match user_status:
            case 'Pending':
                if role == 'Helper':
                    raise forbidden_helper
                to_update.update({'helper': None, 'finished_at': None})
            case 'Process':
                if role == 'Helper':
                    raise forbidden_helper
                to_update.update({'helper': helper, 'finished_at': None})
                is_user_helper = await self.user_repo.get_user_by_id_user_helper(
                    user_id=helper
                )
                if not is_user_helper:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail=[
                            {
                                'msg': 'No helper with this id'
                            }
                        ]
                    )
            case 'Cancelled':
                if role == 'Helper':
                    if reason_reject == 'Physical':
                        add_points_helper = 0
                    elif reason_reject == 'Plans':
                        add_points_helper = -task_points
                    else:
                        add_points_helper = -task_points
                elif role == 'Needy':
                    if reason_reject in ('Physical', 'Search'):
                        add_points_needy = 0
                    elif reason_reject == 'Plans':
                        add_points_needy = -task_points * 0.01
                    else:
                        add_points_needy = -task_points * 0.01
                to_update.update({'finished_at': datetime.now()})
            case 'Completed':
                add_points_helper = task_points + review_points
                add_points_needy = 0.01 + review_points * 0.02

                to_update.update({'finished_at': datetime.now()})

        update_task = await self.task_repo.update_task(
            user_id=user_id,
            task_id=task_id,
            to_update=to_update
        )
        await self.task_repo.commit()
        task_scalar = update_task.scalar()

        if not task_scalar:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= [
                    {
                        'msg': 'No task with this id / No access to update'
                    }
                ]
            )

        if user_status in ('Cancelled', 'Completed'):
            helper_id = task_scalar.helper
            needy_id = task_scalar.needy

            for user_id, role, add_points in \
                    ((helper_id, 'Helper', add_points_helper),
                     (needy_id, 'Needy', add_points_needy)):
                update_activity = await self.user_repo.update_rating(
                    user_id=user_id,
                    role=role,
                    add_points=add_points
                )
                await self.user_repo.commit()

                if not update_activity:
                    await self.task_repo.rollback()
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail= [
                            {
                                'msg': 'No helper or needy with this id in task'
                            }
                        ]
                    )
        return {'detail': f'Task and activity successfully updated'}

    async def processing_report(
            self,
            user_id: int,
            role: str,
            task_id: UUID
    ):
        if role == 'Needy':
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=[
                    {
                        'msg': "This method can`t be use by needy"
                    }
                ]
            )

        task = await self.task_repo.get_task_by_id(
            task_id=task_id,
            user_id=user_id
        )
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= [
                    {
                        'msg': 'No task with this id / No access to process'
                    }
                ]
            )

        blacklist_task = await self.blck_task_repo.get_blacklist_task(
            user_id=user_id,
            task_id=task_id
        )
        if blacklist_task:
            raise HTTPException(
                status_code = status.HTTP_409_CONFLICT,
                detail = [
                    {
                        'msg': 'Report has already been processed'
                    }
                ]
            )

        await self.blck_task_repo.insert_blacklist_task(
            user_id=user_id,
            task_id=task_id
        )

        updated_activity_needy = await self.user_repo.update_count_reports(
            user_id=task.needy
        )

        updated_activity_needy_scalar = updated_activity_needy.scalar()
        if updated_activity_needy_scalar.count_reports % 3 == 0:
            updated_activity_needy_scalar.rating -= 0.01

        await self.user_repo.commit()

        return {'detail': 'Report successfully processed'}

