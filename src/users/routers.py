from typing import List

from fastapi import APIRouter, UploadFile, File, Depends, Header, HTTPException, Security, status
from fastapi.responses import JSONResponse

from .schemas import AddUser, GetUserResponse, AddUserResponse, GetUserByToken, UpdateUser, UpdateUserResponse
from ..core.dependecies import get_user_service, get_current_user

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
        last_name=add_user.last_name,
        role=add_user.role.value,
        city=add_user.city,
        url=add_user.url
    )

@router.get('/list')#, response_model=List[GetUserResponse])
async def create_get_all_users(
        user_service = Depends(get_user_service),
        current_user: GetUserByToken = Depends(get_current_user)
):
    return await user_service.get_all_users(
        user_id=current_user.user_id,
        role=current_user.role
    )

@router.get('/', response_model=GetUserResponse)
async def create_get_user(
        user_service = Depends(get_user_service),
        current_user: GetUserByToken = Depends(get_current_user)
):
    """ Получение данных о пользователе """
    return await user_service.get_user(user_id=current_user.user_id)

@router.patch('/', response_model=UpdateUserResponse)
async def create_update_user(
        update_user: UpdateUser,
        user_service=Depends(get_user_service),
        current_user: GetUserByToken = Depends(get_current_user)
):
    """ Оновление данных о пользователе """
    return await user_service.update_user(
        user_id=current_user.user_id,
        city=update_user.city
    )
