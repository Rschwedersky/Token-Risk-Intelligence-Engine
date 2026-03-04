from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings
from app.db.models import Token, TokenAnalytics, HolderSnapshot, VestingSchedule

settings = get_settings()

# Global client reference
_client = None


async def init_db():
    """Initialize MongoDB connection and create indexes."""
    global _client
    _client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = _client.get_database("tokenrisk")

    await init_beanie(
        database=db,
        document_models=[Token, TokenAnalytics, HolderSnapshot, VestingSchedule],
    )


async def get_db():
    """Get database session (Beanie handles connection pooling)."""
    # Beanie is document-based, so we just return None
    # Models are accessed directly
    return None


async def close_db():
    """Close MongoDB connection."""
    global _client
    if _client:
        _client.close()
