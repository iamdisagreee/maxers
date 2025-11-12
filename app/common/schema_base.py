from pydantic import BaseModel, ConfigDict, alias_generators, Field, EmailStr


class CamelCaseModel(BaseModel):
    model_config = ConfigDict(
        validate_by_name=True,
        alias_generator=alias_generators.to_camel,
        from_attributes=True
    )
