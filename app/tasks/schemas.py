from datetime import datetime
from typing import Literal, Optional
from enum import Enum
from pydantic import field_validator

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
    address: str

    @field_validator('name', mode='after')
    @classmethod
    def capitalize_string_fields(cls, value: str) -> str:
        return value.capitalize()

class GetTaskResponse(CamelCaseModel):
    status: str
    needy: int
    helper: Optional[int]
    points: int
    category: CategoryEnum
    name: str
    description: str
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
