from typing import Literal

from pydantic import BaseModel, ConfigDict, alias_generators, Field, EmailStr


class CamelCaseModel(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True,
        alias_generator=alias_generators.to_camel,
        from_attributes=True
    )

class AddUser(CamelCaseModel):
    user_id: int
    username: str
    first_name: str
    role: Literal['Helper', 'Needy']
    city: str