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

class UpdateTask(CamelCaseModel):
    status: Literal['Pending', 'Process', 'Cancelled', 'Completed']
