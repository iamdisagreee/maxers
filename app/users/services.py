import aiohttp
from fastapi import UploadFile, HTTPException, status
from fastapi.responses import JSONResponse

from .repositories import UserRepository

class UserService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    @staticmethod
    async def check_city(city: str):
        url = f"https://nominatim.openstreetmap.org/search?q={city}&format=json"
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                return await response.json()

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

        await self.user_repo.add_user(
            user_id=user_id,
            username=username,
            first_name=first_name,
            role=role,
            city=city
        )

        return JSONResponse(
            content={
                'detail': 'User successfully created!'
            }
        )
