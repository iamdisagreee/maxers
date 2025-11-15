from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    bot_token: Optional[str] = None
    bot_id: Optional[int] = None
    bot_username: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file ='.env',
        env_file_encoding='utf-8',
        extra='ignore'
    )

@lru_cache()
def get_settings():
    return Settings()


