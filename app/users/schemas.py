from typing import Literal
from datetime import datetime
from pydantic import BaseModel, ConfigDict, alias_generators, Field, EmailStr, computed_field

from ..common.model_base import CamelCaseModel


class AddUser(CamelCaseModel):
    user_id: int
    username: str
    first_name: str
    role: Literal['Helper', 'Needy']
    city: str

class AddUserResponse(CamelCaseModel):
    detail: str
    access_token: str

class GetActivityResponse(CamelCaseModel):
    rating: float
    completed_tasks: int

class GetUserResponse(CamelCaseModel):
    user_id: int = Field(alias="id")
    username: str
    first_name: str
    role: str
    city: str
    created_at: datetime
    activity: GetActivityResponse

