from fastapi import APIRouter, UploadFile, File, Depends, Header, HTTPException, Security, status
from fastapi.responses import JSONResponse

from .schemas import AddUser, GetUserResponse, AddUserResponse
from ..core.dependecies import get_user_service

router = APIRouter(prefix='/users', tags=['users'])

@router.post('/', response_model=AddUserResponse, status_code=status.HTTP_201_CREATED)
async def create_add_user(
        add_user: AddUser,
        user_service = Depends(get_user_service)):
    """ Создание пользователя """
    return await user_service.add_user(
        user_id=add_user.user_id,
        username=add_user.username,
        first_name=add_user.first_name,
        role=add_user.role,
        city=add_user.city
    )

@router.get('/{user_id}', response_model=GetUserResponse)
async def create_get_user(
        user_id: int,
        user_service = Depends(get_user_service)
):
    """ Получение данных о пользователе """
    return await user_service.get_user(user_id=user_id)