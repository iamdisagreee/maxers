from datetime import datetime
from typing import Literal, Optional

from ..common.model_base import CamelCaseModel

class TaskResponse(CamelCaseModel):
    detail: str

class AddTask(CamelCaseModel):
    needy: int
    category: str
    name: str
    description: str
    address: str

class GetTaskResponse(CamelCaseModel):
    status: str
    needy: int
    helper: Optional[int]
    points: int
    category: str
    name: str
    description: str
    address: str
    created_at: datetime
    finished_at: Optional[datetime]

class UpdateTaskRating(CamelCaseModel):
    task_points: Optional[int] = 0
    review_points: int = 0
    reason_reject: Literal['Physical', 'Plans', 'Search'] | None

class UpdateTask(CamelCaseModel):
    status: Literal['Pending', 'Process', 'Cancelled', 'Completed']
    helper: Optional[str]
    role: str
    rating: UpdateTaskRating

