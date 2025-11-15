from datetime import datetime
from typing import Literal, Optional, Annotated
from enum import Enum
from uuid import UUID
from zoneinfo import ZoneInfo

from click.types import UUIDParameterType
from pydantic import field_validator, Field

from ..common.schema_base import CamelCaseModel

class TaskResponse(CamelCaseModel):
    detail: str

class CategoryEnum(Enum):
    medicine = 'Medicine'
    repairs = 'Repairs'
    technique = 'Technique'
    physical = 'Physical'
    communication = 'Communication'
    different = 'Different'

class AddTask(CamelCaseModel):
    category: CategoryEnum
    name: str
    description: str
    city: str
    address: str

    @field_validator('city', 'name', mode='after')
    @classmethod
    def capitalize_string_fields(cls, value: str) -> str:
        return value.capitalize()

# class GetAllTasks(CamelCaseModel):
#     page: Annotated[int, Field(gt=0)] = 1

class GetTaskResponse(CamelCaseModel):
    id: UUID
    status: str
    needy: int
    helper: Optional[int]
    points: int
    category: CategoryEnum
    name: str
    description: str
    city: str
    address: str
    created_at: datetime
    finished_at: Optional[datetime]

class UpdateTaskRating(CamelCaseModel):
    task_points: Optional[int] = None
    review_points: Optional[int] = None
    reason_reject: Literal['Physical', 'Plans', 'Search'] | None

class UpdateTask(CamelCaseModel):
    status: Literal['Pending', 'Process', 'Cancelled', 'Completed']
    helper: Optional[int] = None
    rating: UpdateTaskRating

# class ProcessingReport(CamelCaseModel):
