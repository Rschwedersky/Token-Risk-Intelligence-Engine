# ERC20 Contract ABI - Standard ERC20 interface
ERC20_ABI = [
    {
        "constant": True,
        "inputs": [],
        "name": "name",
        "outputs": [{"name": "", "type": "string"}],
        "type": "function",
    },
    {
        "constant": True,
        "inputs": [],
        "name": "symbol",
        "outputs": [{"name": "", "type": "string"}],
        "type": "function",
    },
    {
        "constant": True,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "type": "function",
    },
    {
        "constant": True,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function",
    },
    {
        "constant": True,
        "inputs": [{"name": "owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function",
    },
    {
        "constant": False,
        "inputs": [
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"},
        ],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function",
    },
    {
        "constant": True,
        "inputs": [
            {"name": "_owner", "type": "address"},
            {"name": "_spender", "type": "address"},
        ],
        "name": "allowance",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function",
    },
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "from", "type": "address"},
            {"indexed": True, "name": "to", "type": "address"},
            {"indexed": False, "name": "value", "type": "uint256"},
        ],
        "name": "Transfer",
        "type": "event",
    },
    {
        "anonymous": False,
        "inputs": [
            {"indexed": True, "name": "owner", "type": "address"},
            {"indexed": True, "name": "spender", "type": "address"},
            {"indexed": False, "name": "value", "type": "uint256"},
        ],
        "name": "Approval",
        "type": "event",
    },
]


class ERC20:
    """ERC20 token utilities."""

    def __init__(self, address: str, chain_instance):
        self.address = address
        self.chain = chain_instance

    async def get_name(self) -> str:
        """Get token name."""
        return await self.chain.call_contract(self.address, ERC20_ABI, "name")

    async def get_symbol(self) -> str:
        """Get token symbol."""
        return await self.chain.call_contract(self.address, ERC20_ABI, "symbol")

    async def get_decimals(self) -> int:
        """Get token decimals."""
        return await self.chain.call_contract(self.address, ERC20_ABI, "decimals")

    async def get_total_supply(self) -> int:
        """Get total supply."""
        return await self.chain.call_contract(self.address, ERC20_ABI, "totalSupply")

    async def get_balance(self, owner: str) -> int:
        """Get balance of address."""
        return await self.chain.call_contract(
            self.address, ERC20_ABI, "balanceOf", owner
        )
