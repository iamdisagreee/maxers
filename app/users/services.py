from datetime import datetime, timezone, timedelta

import jwt
import aiohttp
import secrets
from fastapi import UploadFile, HTTPException, status
from fastapi.responses import JSONResponse

from .repositories import UserRepository
from .schemas import GetUserResponse
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
                detail=[
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

        access_token = self.create_access_token(
            {'sub': str(user_id), 'role': role}
        )

        return {
            'detail': 'User successfully created',
            'access_token': access_token
        }

    async def get_all_users(
            self,
            user_id: int,
            role: str
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
        limit = 5
        all_users = await self.user_repo.get_all_users_by_role(
            role=role,
            limit=limit
        )
        all_users_scalars = all_users.all()
        all_user_ids = tuple(x.id for x in all_users_scalars)
        current_user = await self.user_repo.get_user_rank_and_data(
            user_id=user_id,
            role=role
        )
        current_user_dict = GetUserResponse.model_validate(current_user[0]).model_dump(by_alias=True)
        current_user_dict['place'] = current_user[1]
        current_user_dict['is_top'] = user_id in all_user_ids

        return {'users': all_users_scalars, 'current': current_user_dict}

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
                detail=[
                    {
                        'msg': 'No user with this id'
                    }
                ]
            )
        print(user.activity.count_reports)
        return user

    async def update_user(
            self,
            user_id: int,
            city: str
    ):
        if not await self.check_city(city=city):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=[
                    {
                        'msg': 'No city with this name found'
                    }
                ]
            )

        updated_user = await self.user_repo.update_user(
            user_id=user_id,
            city=city
        )

        await self.user_repo.commit()

        return {'detail': 'User successfully updated'}
