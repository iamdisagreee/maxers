from uuid import UUID

from fastapi import APIRouter, UploadFile, File, Depends, Header, HTTPException, Security, status
from fastapi.responses import JSONResponse

from .schemas import AddTask, TaskResponse, GetTaskResponse, UpdateTask
from ..core.dependecies import get_task_service

router = APIRouter(prefix='/tasks', tags=['tasks'])

@router.post('/', response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_add_task(
        add_task: AddTask,
        task_service = Depends(get_task_service)
):
    """ Создание задачи """
    return await task_service.add_task(
        needy=add_task.needy,
        category=add_task.category,
        name=add_task.name,
        description=add_task.description,
        address=add_task.address,
    )

@router.get('/{task_id}', response_model=GetTaskResponse)
async def create_get_task(
        task_id: UUID,
        task_service=Depends(get_task_service)
):
    """ Получение информации о задаче """
    return await task_service.get_task(task_id=task_id)

@router.patch('/{task_id}', response_model=TaskResponse)
async def create_update_task(
        task_id: UUID,
        update_task: UpdateTask,
        task_service=Depends(get_task_service)

):
    return await task_service.update_task(
        task_id=task_id,
        status=update_task.status
    )