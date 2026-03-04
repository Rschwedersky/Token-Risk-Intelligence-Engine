from app.chains.base import BaseChain
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class OptimismChain(BaseChain):
    """Optimism mainnet integration."""

    def __init__(self, rpc_url: str):
        super().__init__(rpc_url, "optimism")

    async def get_token_holders(self, token_address: str, limit: int = 100) -> list:
        """
        Naively compute holder balances by scanning transfer logs on Optimism.
        Works exactly like the Ethereum implementation above, but may be slower
        because Optimism's chain is larger; consider using an indexer.
        """
        logger.info(f"Fetching holders for {token_address} on Optimism using logs")
        logs = await self.get_token_transfers(token_address, start_block=0)

        balances: dict[str, int] = {}
        for log in logs:
            try:
                from_raw = log["topics"][1].hex()
                to_raw = log["topics"][2].hex()
                from_addr = self.w3.toChecksumAddress("0x" + from_raw[-40:])
                to_addr = self.w3.toChecksumAddress("0x" + to_raw[-40:])
                value = self.w3.codec.decode_single("uint256", log["data"])
            except Exception as e:
                logger.warning(f"failed to decode log {log}: {e}")
                continue

            balances[from_addr] = balances.get(from_addr, 0) - value
            balances[to_addr] = balances.get(to_addr, 0) + value

        holders = [
            {"address": addr, "balance": bal}
            for addr, bal in balances.items()
            if bal > 0
        ]
        holders.sort(key=lambda x: x["balance"], reverse=True)
        return holders[:limit]

    async def get_token_transfers(
        self, token_address: str, start_block: Optional[int] = None
    ) -> list:
        """Get token transfers using Web3 logs."""
        try:
            from_block = start_block or (await self.get_block_number()) - 5000
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
