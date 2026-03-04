from app.chains.base import BaseChain
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class EthereumChain(BaseChain):
    """Ethereum mainnet integration."""

    def __init__(self, rpc_url: str):
        super().__init__(rpc_url, "ethereum")

    async def get_token_holders(self, token_address: str) -> list:
        """
        Get token holders from Ethereum.
        Note: Full holder data requires indexing service like The Graph or Alchemy.
        This is a basic implementation.
        """
        # In production, you'd use The Graph (subgraph) or Alchemy's getAssetTransfers
        # For now, returning empty - will be populated by indexer
        logger.info(f"Fetching holders for {token_address} on Ethereum")
        return []

    async def get_token_transfers(
        self, token_address: str, start_block: Optional[int] = None
    ) -> list:
        """Get token transfers using Web3 logs."""
        try:
            from_block = start_block or (await self.get_block_number()) - 1000
            to_block = await self.get_block_number()

            # ERC20 Transfer event signature
            transfer_signature = self.w3.keccak(
                text="Transfer(address,address,uint256)"
            )

            logs = await self.w3.eth.get_logs(
                {
                    "address": token_address,
                    "topics": [transfer_signature.hex()],
                    "fromBlock": from_block,
                    "toBlock": to_block,
                }
            )

            return logs
        except Exception as e:
            logger.error(f"Error fetching transfers: {e}")
            return []
