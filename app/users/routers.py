from fastapi import APIRouter, UploadFile, File, Depends, Header, HTTPException, Security
from fastapi.responses import JSONResponse

from .schemas import AddUser
from ..core.dependecies import get_user_service

router = APIRouter(prefix='/users', tags=['users'])

@router.post("/", response_class=JSONResponse)
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
