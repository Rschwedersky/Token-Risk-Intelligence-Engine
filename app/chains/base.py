from abc import ABC, abstractmethod
from web3 import Web3, AsyncWeb3
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class BaseChain(ABC):
    """Base class for blockchain interactions."""

    def __init__(self, rpc_url: str, chain_name: str):
        self.rpc_url = rpc_url
        self.chain_name = chain_name
        self.w3 = AsyncWeb3(AsyncWeb3.AsyncHTTPProvider(rpc_url))

    async def is_connected(self) -> bool:
        """Check if connected to RPC."""
        try:
            return await self.w3.is_connected()
        except Exception as e:
            logger.error(f"Connection error to {self.chain_name}: {e}")
            return False

    async def get_block_number(self) -> int:
        """Get latest block number."""
        return await self.w3.eth.block_number

    async def call_contract(
        self, contract_address: str, abi: list, function_name: str, *args, **kwargs
    ):
        """Call contract function."""
        contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(contract_address), abi=abi
        )
        try:
            result = await contract.functions.__getattribute__(function_name)(
                *args
            ).call(**kwargs)
            return result
        except Exception as e:
            logger.error(f"Contract call error: {e}")
            raise

    async def get_code(self, address: str) -> str:
        """Get contract code at address."""
        checksum_address = Web3.to_checksum_address(address)
        return await self.w3.eth.get_code(checksum_address)

    @abstractmethod
    async def get_token_holders(self, token_address: str) -> list:
        """Get token holders. Implementation specific to chain."""
        pass

    @abstractmethod
    async def get_token_transfers(
        self, token_address: str, start_block: Optional[int] = None
    ) -> list:
        """Get token transfers. Implementation specific to chain."""
        pass
