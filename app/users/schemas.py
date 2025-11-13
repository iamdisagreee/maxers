import math
from typing import Literal, List
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, ConfigDict, alias_generators, Field, EmailStr, computed_field, field_validator

from ..common.schema_base import CamelCaseModel


class RoleEnum(Enum):
    helper = 'Helper'
    needy = 'Needy'

class AddUser(CamelCaseModel):
    user_id: int
    username: str
    first_name: str
    role: RoleEnum
    city: str

    @field_validator('username', 'first_name', 'city', mode='after')
    @classmethod
    def capitalize_string_fields(cls, value: str) -> str:
        return value.capitalize()


class AddUserResponse(CamelCaseModel):
    detail: str
    access_token: str

class GetUserByToken(CamelCaseModel):
    user_id: int
    role: str

class GetActivityResponse(CamelCaseModel):
    rating: float
    completed_tasks: int
    count_reports: int

    @field_validator('rating', mode='after')
    @classmethod
    def round_float_fields(cls, value: float) -> float:
        return round(value, 2)


class GetUserResponse(CamelCaseModel):
    user_id: int = Field(alias="id")
    username: str
    first_name: str
    role: str
    city: str
    created_at: datetime
    activity: GetActivityResponse

class GetCurrentUser(GetUserResponse):
    place: int
    is_top: bool

class GetUserResponseList(CamelCaseModel):
    users: List['GetUserResponse']
    current: GetCurrentUser


class UpdateUser(CamelCaseModel):
    city: str

class UpdateUserResponse(CamelCaseModel):
    detail: str