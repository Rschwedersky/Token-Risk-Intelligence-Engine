import os
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # API Configuration
    API_TITLE: str = "Token Risk Intelligence Engine"
    API_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False") == "True"

    # RPC Endpoints
    ETHEREUM_RPC: str = os.getenv("ETHEREUM_RPC", "")
    OPTIMISM_RPC: str = os.getenv("OPTIMISM_RPC", "")

    # MongoDB Atlas
    MONGODB_URL: str = os.getenv("MONGODB_URL", "mongodb://localhost:27017/tokenrisk")

    # Cache settings
    CACHE_TTL: int = 300  # 5 minutes

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
