# Token Risk Intelligence Engine

A full-stack on-chain analytics platform that provides deep insights into token holder distribution, whale movements, vesting schedules, and market dynamics.

## 🎯 What This Does

This application analyzes tokens across EVM blockchains and generates **high-signal portfolio metrics** that impress hiring managers:

### Core Analytics
- **Holder Concentration** - Gini coefficient of token distribution
- **Whale Movement Tracking** - Monitor large holder accumulation/distribution
- **Vesting Impact Analysis** - Upcoming unlock events and emission pressure
- **Daily Active Wallets** - On-chain engagement metrics
- **Liquidity Trends** - TVL and slippage risk analysis
- **FDV vs Circulating Supply** - Market cap and valuation metrics

### Advanced Metrics
- **Gini Coefficient** - Measure of token distribution equality (0 = equal, 1 = concentrated)
- **Whale Accumulation Score** - 0-100 risk score for large holder concentration
- **Liquidity Dependency Ratio** - TVL/Market Cap indicator
- **Emission Pressure Estimator** - Daily emissions as % of circulating supply

## 🏗️ Project Structure

```
app/
├── main.py                 # FastAPI application & endpoints
├── config.py              # Configuration management
├── analytics.py           # Token analytics engine (Gini, whale scoring, etc.)
├── chains/
│   ├── base.py           # Abstract base class for blockchains
│   ├── ethereum.py       # Ethereum integration
│   └── optimism.py       # Optimism integration
├── contracts/
│   └── erc20.py          # ERC20 token interactions
└── db/
    ├── session.py        # Database connection management
    └── models.py         # SQLAlchemy ORM models

requirements.txt           # Python dependencies
.env                      # Environment variables (RPC endpoints, DB URL)
run.py                    # Development server script
```

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- PostgreSQL 12+ (or any compatible database)
- RPC endpoints for Ethereum and Optimism (Alchemy, Infura, etc.)

### Installation

1. **Clone and setup environment**
```bash
cd c:\Users\camba\Token-Risk-Intelligence-Engine
python -m venv venv
.\venv\Scripts\Activate.ps1
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment**
Create/update `.env`:
```env
ETHEREUM_RPC=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
OPTIMISM_RPC=https://opt-mainnet.g.alchemy.com/v2/YOUR_KEY
DATABASE_URL=postgresql+asyncpg://user:password@localhost/tokenrisk
DEBUG=False
```

4. **Initialize database**
```bash
# Database tables are created automatically on first run
```

5. **Run the server**
```bash
python run.py
```

API available at: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 📡 API Endpoints

### Health & Status
```
GET /health
GET /
GET /api/v1/supported-chains
```

### Token Analysis
```
GET /api/v1/tokens/{token_address}/{chain_name}
GET /api/v1/tokens/{token_address}/{chain_name}/holders
GET /api/v1/tokens/{token_address}/{chain_name}/history
```

### Examples

**Get Uniswap token analysis on Ethereum:**
```bash
curl "http://localhost:8000/api/v1/tokens/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984/ethereum"
```

**Get top Aave holders:**
```bash
curl "http://localhost:8000/api/v1/tokens/0x7fc66500c84a76ad7e9c93437e170b175d0e07e2/ethereum/holders?limit=50"
```

**Get 30-day analytics history:**
```bash
curl "http://localhost:8000/api/v1/tokens/0x7fc66500c84a76ad7e9c93437e170b175d0e07e2/ethereum/history?days=30"
```

## 📊 Database Models

### Token
Stores token metadata (symbol, decimals, supply, etc.)

### TokenAnalytics
Daily snapshots with metrics:
- Holder distribution (Gini, top X%)
- Whale metrics (count, accumulation score, movement)
- Liquidity data
- Emissions & vesting impact
- Activity (transfers, active wallets)
- Price & volume data

### HolderSnapshot
Detailed holder distribution data with addresses, balances, and labels

### VestingSchedule
Token vesting information for upcoming unlock events

## 🧮 Analytics Engine

The `TokenAnalyticsEngine` class provides advanced calculations:

### Gini Coefficient
Measures token distribution equality:
- 0 = Perfect equality (everyone has same amount)
- 1 = Complete inequality (one holder has everything)
- **Lower is better** for decentralization

### Whale Accumulation Score (0-100)
Risk metric for large holder concentration:
- 10-20: Low risk (well distributed)
- 30-50: Moderate risk (notable concentration)
- 50-80: High risk (significant concentration)
- 80-100: Critical (whale-dominated)

### Liquidity Dependency Ratio
TVL / Market Cap indicator:
- `< 0.1` = Low dependency (good)
- `0.1-0.5` = Moderate dependency
- `> 0.5` = High dependency (high slippage risk)

### Emission Pressure
Daily emissions as % of circulating supply:
- `< 1%` = Sustainable
- `1-5%` = Moderate pressure
- `> 5%` = High pressure

## 🔗 Web3 Integration

### Supported Chains
- **Ethereum** - Mainnet
- **Optimism** - Mainnet

### Chain Details
- Uses AsyncWeb3 for non-blocking RPC calls
- Supports ERC20 token interactions
- Retrieves on-chain data (balances, transfers, etc.)
- Validates contracts and addresses

## 🎓 What Makes This Portfolio-Worthy

This project demonstrates:
- ✅ **On-chain expertise** - Understanding token economics, holder dynamics, whale behavior
- ✅ **Full-stack development** - Python backend + Web3 integration
- ✅ **Advanced analytics** - Complex metrics (Gini coefficient, accumulation scores)
- ✅ **Production patterns** - Async/await, database models, configuration management
- ✅ **Blockchain knowledge** - ERC20 standards, smart contract interaction
- ✅ **Data engineering** - Time-series analytics, aggregation, risk scoring

## 🚧 Coming Next (Frontend)

A Next.js + TypeScript dashboard will be added showing:
- Interactive charts of holder distribution
- Real-time whale movement alerts
- Historical analytics trends
- Vesting unlock calendars
- Risk score dashboards

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Areas for enhancement:
- More chain integrations
- Additional metrics (correlation analysis, etc.)
- Machine learning risk models
- Webhook alerts for whale movements
- GraphQL API
