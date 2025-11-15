from typing import List, Annotated, Literal
from uuid import UUID
from pydantic import Field

from fastapi import APIRouter, UploadFile, File, Depends, Header, HTTPException, Security, status, Path
from fastapi.responses import JSONResponse

from .schemas import AddTask, TaskResponse, GetTaskResponse, UpdateTask
from ..core.dependecies import get_task_service, get_current_user
from ..users.schemas import GetUserByToken

router = APIRouter(prefix='/tasks', tags=['tasks'])

@router.post('/', response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_add_task(
        add_task: AddTask,
        task_service = Depends(get_task_service),
        current_user: GetUserByToken = Depends(get_current_user)
):
    """ Создание задачи """
    return await task_service.add_task(
        user_id=current_user.user_id,
        role=current_user.role,
        category=add_task.category.value,
        name=add_task.name,
        description=add_task.description,
        city=add_task.city,
        address=add_task.address,
    )

@router.get('/list/{page}', response_model=List[GetTaskResponse])
async def create_get_all_tasks(
        page: Annotated[int, Field(gt=0)],
        type_list: Literal['user', 'pending'],
        task_service=Depends(get_task_service),
        current_user: GetUserByToken = Depends(get_current_user)
):
    """ Получение всех заданий """
    return await task_service.get_all_tasks(
        user_id=current_user.user_id,
        city=current_user.city,
        type_list=type_list,
        page=page,
    )

@router.get('/{task_id}', response_model=GetTaskResponse)
async def create_get_task(
        task_id: UUID,
        task_service=Depends(get_task_service),
        current_user: GetUserByToken = Depends(get_current_user)
):
    """ Получение информации о задании """
    return await task_service.get_task(
        user_id=current_user.user_id,
        role=current_user.role,
        task_id=task_id
    )

@router.patch('/{task_id}', response_model=TaskResponse)
async def create_update_task(
        task_id: UUID,
        update_task: UpdateTask,
        task_service=Depends(get_task_service),
        current_user: GetUserByToken = Depends(get_current_user)
):
    """ Обновление задания """
    return await task_service.update_task(
        user_id=current_user.user_id,
        role=current_user.role,
        task_id=task_id,
        user_status=update_task.status,
        helper=update_task.helper,
        task_points=update_task.rating.task_points,
        review_points=update_task.rating.review_points,
        reason_reject=update_task.rating.reason_reject
    )

@router.post('/{task_id}/reports', response_model=TaskResponse)
async def create_processing_report(
        task_id: UUID,
        task_service=Depends(get_task_service),
        current_user: GetUserByToken = Depends(get_current_user)
):
    """ Обработка жалобы от хелпера на задание """
    return await task_service.processing_report(
        user_id=current_user.user_id,
        role=current_user.role,
        task_id=task_id
    )
