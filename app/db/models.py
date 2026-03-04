from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field


class Token(Document):
    """Token metadata and analytics."""

    address: str = Field(..., index=True, unique=True)
    chain: str = Field(..., index=True)  # ethereum, optimism, etc
    symbol: str
    name: str
    decimals: int
    total_supply: str = Field(default="0")  # Store as string to handle large numbers
    circulating_supply: Optional[str] = None
    fully_diluted_valuation: Optional[float] = None  # FDV in USD
    market_cap: Optional[float] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "tokens"


class TokenAnalytics(Document):
    """Daily snapshot of token analytics."""

    token_id: Optional[str] = None
    token_address: str = Field(..., index=True)

    # Holder metrics
    holder_count: Optional[int] = None
    unique_holders_24h: Optional[int] = None
    top_10_holder_percentage: Optional[float] = None
    top_100_holder_percentage: Optional[float] = None
    gini_coefficient: Optional[float] = None  # 0 = equal, 1 = concentrated

    # Whale metrics
    whale_count: Optional[int] = None
    whale_accumulation_score: Optional[float] = None
    whale_movement_24h: Optional[float] = None

    # Liquidity metrics
    total_liquidity: Optional[float] = None  # USD value
    liquidity_dependency_ratio: Optional[float] = None

    # Vesting & emissions
    daily_emissions: Optional[float] = None
    emission_pressure_estimator: Optional[float] = None
    vesting_unlock_24h: Optional[float] = None

    # Activity metrics
    daily_active_wallets: Optional[int] = None
    transfer_volume_24h: Optional[float] = None
    unique_transfers_24h: Optional[int] = None

    # Price & volatility
    price_change_24h: Optional[float] = None
    volume_24h: Optional[float] = None

    snapshot_date: datetime = Field(default_factory=datetime.utcnow, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "token_analytics"


class HolderSnapshot(Document):
    """Holder distribution snapshot."""

    token_address: str = Field(..., index=True)
    holder_address: str
    balance: str = Field(default="0")  # Store as string to handle large numbers
    percentage_of_supply: Optional[float] = None

    is_whale: bool = False
    is_contract: bool = False
    label: Optional[str] = None

    snapshot_date: datetime = Field(default_factory=datetime.utcnow, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "holder_snapshots"


class VestingSchedule(Document):
    """Token vesting information."""

    token_address: str = Field(..., index=True)
    name: Optional[str] = None
    total_amount: str = Field(default="0")  # Store as string
    released_amount: str = Field(default="0")
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    cliff_date: Optional[datetime] = None
    description: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "vesting_schedules"
