"""
Seed MongoDB with mock token analytics data for testing.
"""

import asyncio
from datetime import datetime, timedelta
from app.db.models import Token, TokenAnalytics, HolderSnapshot
from app.db.session import init_db


async def seed_data():
    """Populate MongoDB with sample tokens and analytics."""
    await init_db()

    # Create sample tokens
    uniswap = Token(
        address="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        chain="ethereum",
        symbol="UNI",
        name="Uniswap",
        decimals=18,
        total_supply="1000000000000000000000000000",
        circulating_supply="600000000000000000000000000",
        fully_diluted_valuation=5_000_000_000,
        market_cap=3_000_000_000,
    )

    aave = Token(
        address="0x7fc66500c84a76ad7e9c93437e170b175d0e07e2",
        chain="ethereum",
        symbol="AAVE",
        name="Aave",
        decimals=18,
        total_supply="16000000000000000000000000",
        circulating_supply="13000000000000000000000000",
        fully_diluted_valuation=2_600_000_000,
        market_cap=2_100_000_000,
    )

    # Save tokens
    await uniswap.save()
    await aave.save()
    print("✓ Created 2 sample tokens")

    # Create analytics for UNI
    uni_analytics = TokenAnalytics(
        token_address=uniswap.address,
        holder_count=450_000,
        unique_holders_24h=12_500,
        top_10_holder_percentage=15.3,
        top_100_holder_percentage=42.7,
        gini_coefficient=0.68,
        whale_count=127,
        whale_accumulation_score=45.2,
        whale_movement_24h=2.5,
        total_liquidity=850_000_000,
        liquidity_dependency_ratio=0.28,
        daily_emissions=0,
        emission_pressure_estimator=0.0,
        vesting_unlock_24h=0,
        daily_active_wallets=8_900,
        transfer_volume_24h=1_200_000_000,
        unique_transfers_24h=18_500,
        price_change_24h=2.3,
        volume_24h=1_500_000_000,
        snapshot_date=datetime.utcnow(),
    )

    # Create analytics for AAVE
    aave_analytics = TokenAnalytics(
        token_address=aave.address,
        holder_count=185_000,
        unique_holders_24h=4_200,
        top_10_holder_percentage=18.5,
        top_100_holder_percentage=51.2,
        gini_coefficient=0.72,
        whale_count=89,
        whale_accumulation_score=62.1,
        whale_movement_24h=-1.8,
        total_liquidity=425_000_000,
        liquidity_dependency_ratio=0.20,
        daily_emissions=50_000,
        emission_pressure_estimator=0.38,
        vesting_unlock_24h=125_000,
        daily_active_wallets=3_200,
        transfer_volume_24h=580_000_000,
        unique_transfers_24h=7_500,
        price_change_24h=-1.5,
        volume_24h=620_000_000,
        snapshot_date=datetime.utcnow(),
    )

    await uni_analytics.save()
    await aave_analytics.save()
    print("✓ Created analytics for 2 tokens")

    # Create sample holders for UNI
    holders = [
        HolderSnapshot(
            token_address=uniswap.address,
            holder_address="0x1111111111111111111111111111111111111111",
            balance="5000000000000000000000000",
            percentage_of_supply=0.83,
            is_whale=True,
            label="Uniswap Treasury",
        ),
        HolderSnapshot(
            token_address=uniswap.address,
            holder_address="0x2222222222222222222222222222222222222222",
            balance="3200000000000000000000000",
            percentage_of_supply=0.53,
            is_whale=True,
            label="Grayscale",
        ),
        HolderSnapshot(
            token_address=uniswap.address,
            holder_address="0x3333333333333333333333333333333333333333",
            balance="2100000000000000000000000",
            percentage_of_supply=0.35,
            is_whale=True,
            label="Paradigm",
        ),
        HolderSnapshot(
            token_address=uniswap.address,
            holder_address="0x4444444444444444444444444444444444444444",
            balance="850000000000000000000000",
            percentage_of_supply=0.14,
            is_whale=False,
        ),
        HolderSnapshot(
            token_address=uniswap.address,
            holder_address="0x5555555555555555555555555555555555555555",
            balance="450000000000000000000000",
            percentage_of_supply=0.075,
            is_whale=False,
        ),
    ]

    for holder in holders:
        await holder.save()
    print(f"✓ Created {len(holders)} sample holders for UNI")

    print("\n✅ Database seeded successfully!")
    print(
        "Try: curl http://localhost:8000/api/v1/tokens/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984/ethereum"
    )


if __name__ == "__main__":
    asyncio.run(seed_data())
