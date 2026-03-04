import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

from app.config import get_settings
from app.db.session import init_db
from app.db.models import Token, TokenAnalytics, HolderSnapshot
from app.chains.ethereum import EthereumChain
from app.chains.optimism import OptimismChain
from app.contracts.erc20 import ERC20

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()


# Lifespan management
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Token Risk Intelligence Engine")
    try:
        await init_db()
    except Exception as e:
        logger.warning(f"Database init warning: {e}")
    yield
    # Shutdown
    logger.info("Shutting down")


# Initialize FastAPI app
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize chain instances
ethereum = EthereumChain(settings.ETHEREUM_RPC)
optimism = OptimismChain(settings.OPTIMISM_RPC)


# ============================================================================
# HEALTH & STATUS ENDPOINTS
# ============================================================================


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    eth_connected = await ethereum.is_connected()
    opt_connected = await optimism.is_connected()

    return {
        "status": "healthy" if eth_connected or opt_connected else "unhealthy",
        "ethereum_connected": eth_connected,
        "optimism_connected": opt_connected,
    }


# ============================================================================
# TOKEN ANALYSIS ENDPOINTS
# ============================================================================


@app.get("/api/v1/tokens/{token_address}/{chain_name}")
async def get_token_analysis(
    token_address: str,
    chain_name: str,
):
    """
    Get comprehensive token analysis.

    Args:
        token_address: Token contract address
        chain_name: ethereum or optimism

    Returns:
        Token metadata and latest analytics
    """
    # Get chain instance
    if chain_name.lower() == "ethereum":
        chain = ethereum
    elif chain_name.lower() == "optimism":
        chain = optimism
    else:
        raise HTTPException(status_code=400, detail="Invalid chain")

    # Check if token exists in DB
    token = await Token.find_one(
        Token.address == token_address, Token.chain == chain_name
    )

    if not token:
        # Try to fetch from chain if not in DB
        try:
            erc20 = ERC20(token_address, chain)
            name = await erc20.get_name()
            symbol = await erc20.get_symbol()
            decimals = await erc20.get_decimals()
            total_supply = await erc20.get_total_supply()

            # Create token in DB (convert total_supply to string)
            token = Token(
                address=token_address,
                chain=chain_name,
                symbol=symbol,
                name=name,
                decimals=decimals,
                total_supply=str(total_supply),  # Convert int to string
            )
            await token.save()
        except Exception as e:
            logger.error(f"Error fetching token: {e}")
            raise HTTPException(status_code=404, detail="Token not found")

    # Get latest analytics
    analytics = await TokenAnalytics.find_one(
        TokenAnalytics.token_address == token_address, sort=[("snapshot_date", -1)]
    )

    return {
        "token": {
            "address": token.address,
            "name": token.name,
            "symbol": token.symbol,
            "decimals": token.decimals,
            "chain": token.chain,
            "total_supply": token.total_supply,
            "circulating_supply": token.circulating_supply,
            "fdv": token.fully_diluted_valuation,
            "market_cap": token.market_cap,
        },
        "analytics": analytics.dict() if analytics else None,
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/api/v1/tokens/{token_address}/{chain_name}/holders")
async def get_token_holders(
    token_address: str,
    chain_name: str,
    limit: int = 100,
):
    """
    Get top token holders.

    Args:
        token_address: Token contract address
        chain_name: ethereum or optimism
        limit: Number of top holders to return (default 100)

    Returns:
        List of top holders with their balances and percentages
    """
    # Get latest holder snapshots
    holders = (
        await HolderSnapshot.find(
            HolderSnapshot.token_address == token_address,
            sort=[("snapshot_date", -1), ("balance", -1)],
        )
        .limit(limit)
        .to_list()
    )

    if not holders:
        return {"data": [], "timestamp": datetime.utcnow().isoformat()}

    return {
        "data": [
            {
                "holder_address": h.holder_address,
                "balance": h.balance,
                "percentage_of_supply": h.percentage_of_supply,
                "is_whale": h.is_whale,
                "is_contract": h.is_contract,
                "label": h.label,
            }
            for h in holders
        ],
        "timestamp": (
            holders[0].snapshot_date.isoformat()
            if holders
            else datetime.utcnow().isoformat()
        ),
    }


@app.get("/api/v1/tokens/{token_address}/{chain_name}/history")
async def get_token_analytics_history(
    token_address: str,
    chain_name: str,
    days: int = 30,
):
    """
    Get token analytics history.

    Args:
        token_address: Token contract address
        chain_name: ethereum or optimism
        days: Number of days to retrieve (default 30)

    Returns:
        Historical analytics snapshots
    """
    cutoff_date = datetime.utcnow() - timedelta(days=days)

    analytics = await TokenAnalytics.find(
        TokenAnalytics.token_address == token_address,
        TokenAnalytics.snapshot_date >= cutoff_date,
        sort=[("snapshot_date", 1)],
    ).to_list()

    return {
        "data": [
            {
                "snapshot_date": a.snapshot_date.isoformat(),
                "holder_count": a.holder_count,
                "unique_holders_24h": a.unique_holders_24h,
                "gini_coefficient": a.gini_coefficient,
                "whale_count": a.whale_count,
                "whale_accumulation_score": a.whale_accumulation_score,
                "top_10_percentage": a.top_10_holder_percentage,
                "top_100_percentage": a.top_100_holder_percentage,
                "liquidity_dependency_ratio": a.liquidity_dependency_ratio,
                "daily_active_wallets": a.daily_active_wallets,
                "transfer_volume_24h": a.transfer_volume_24h,
                "emission_pressure": a.emission_pressure_estimator,
                "price_change_24h": a.price_change_24h,
            }
            for a in analytics
        ],
        "timestamp": datetime.utcnow().isoformat(),
    }


# ============================================================================
# UTILITY ENDPOINTS
# ============================================================================


@app.get("/api/v1/supported-chains")
async def get_supported_chains():
    """Get list of supported blockchains."""
    return {
        "chains": [
            {"name": "ethereum", "connected": await ethereum.is_connected()},
            {"name": "optimism", "connected": await optimism.is_connected()},
        ]
    }


@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": settings.API_TITLE,
        "version": settings.API_VERSION,
        "docs": "/docs",
        "health": "/health",
    }
