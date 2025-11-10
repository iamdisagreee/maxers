from datetime import datetime, timezone, timedelta

import jwt
import aiohttp
import secrets
from fastapi import UploadFile, HTTPException, status
from fastapi.responses import JSONResponse

from .repositories import UserRepository
from ..config import Settings


class UserService:
    def __init__(
            self,
            user_repo: UserRepository,
            settings: Settings
    ):
        self.user_repo = user_repo
        self.settings = settings

    @staticmethod
    async def check_city(city: str):
        url = f"https://nominatim.openstreetmap.org/search?country=Russia&city={city}&format=json"
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                return await response.json()

    def create_access_token(
            self,
            data: dict
    ):
        return jwt.encode(data, self.settings.jwt_secret_key, self.settings.jwt_algorithm)

    async def add_user(
            self,
            user_id: int,
            username: str,
            first_name: str,
            role: str,
            city: str
    ):
        if not await self.check_city(city=city):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= [
                    {
                        'msg': 'No city with this name found'
                    }
                ]
            )

        user = await self.user_repo.get_user_by_id(user_id=user_id)

        if user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=[
                    {
                        'msg': 'User already registered'
                    }
                ]
            )

        await self.user_repo.add_user(
            user_id=user_id,
            username=username,
            first_name=first_name,
            role=role,
            city=city
        )

        base_rating = 0 if role == 'Helper' else 5

        await self.user_repo.initialization_activity(
            user_id=user_id,
            rating=base_rating
        )

        access_token = self.create_access_token({'sub': user_id})

        return {
                'detail': 'User successfully created',
                'access_token': access_token
            }

    async def get_user(
            self,
            user_id: int
    ):
        user = await self.user_repo.get_user_by_id(
            user_id=user_id
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail= [
                    {
                        'msg': 'No user with this id'
                    }
                ]
            )
        return user
