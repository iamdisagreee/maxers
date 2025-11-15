from typing import Annotated

import jwt
from fastapi import Depends, Header, HTTPException, status, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession


from .postgres import session_maker
from ..common.repositories import BlacklistTaskRepository
from ..config import get_settings, Settings
from ..tasks.repositories import TaskRepository
from ..tasks.services import TaskService
from ..users.repositories import UserRepository
from ..users.schemas import GetUserByToken
from ..users.services import UserService

security = HTTPBearer()

async def get_postgres() -> AsyncSession:
    async with session_maker() as session:
        yield session

async def get_user_repository(
        postgres: AsyncSession = Depends(get_postgres)
) -> UserRepository:
    return UserRepository(postgres=postgres)

async def get_user_service(
        user_repo: UserRepository = Depends(get_user_repository),
        settings: Settings = Depends(get_settings)
):
    return UserService(
        user_repo=user_repo,
        settings=settings
    )

async def get_task_repository(
        postgres: AsyncSession = Depends(get_postgres)
) -> TaskRepository:
    return TaskRepository(postgres=postgres)

async def get_blacklist_task_repository(
        postgres: AsyncSession = Depends(get_postgres)
) -> BlacklistTaskRepository:
    return BlacklistTaskRepository(postgres=postgres)

async def get_task_service(
        task_repo: TaskRepository = Depends(get_task_repository),
        user_repo: UserRepository = Depends(get_user_repository),
        blacklist_task_repo: BlacklistTaskRepository = Depends(get_blacklist_task_repository)
) -> TaskService:
    return TaskService(
        task_repo=task_repo,
        user_repo=user_repo,
        blck_task_repo=blacklist_task_repo
    )

async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Security(security),
        user_repo: UserRepository = Depends(get_user_repository),
        settings: Settings = Depends(get_settings)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=[{'msg':'Could not validate credentials',}],
        headers={'WWW-Authentication': "Bearer"}
    )

    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user_id = int(payload.get('sub'))
        role = payload.get('role')
        city = payload.get('city')
    except jwt.PyJWTError:
        raise credentials_exception

    user = await user_repo.get_user_by_id(user_id=user_id)
    if user is None:
        raise credentials_exception
    return GetUserByToken.model_validate({'user_id':user_id, 'role':role, 'city': city})

