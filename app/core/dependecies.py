from fastapi import Depends, Header, HTTPException, status, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from .postgres import session_maker
from ..users.repositories import UserRepository
from ..users.services import UserService


async def get_postgres() -> AsyncSession:
    async with session_maker() as session:
        yield session

async def get_user_repository(
        postgres: AsyncSession = Depends(get_postgres)
) -> UserRepository:
    return UserRepository(postgres=postgres)

async def get_user_service(
        user_repo: UserRepository = Depends(get_user_repository)
):
    return UserService(user_repo=user_repo)