from app.chains.base import BaseChain
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class EthereumChain(BaseChain):
    """Ethereum mainnet integration."""

    def __init__(self, rpc_url: str):
        super().__init__(rpc_url, "ethereum")

    async def get_token_holders(self, token_address: str, limit: int = 100) -> list:
        """
        Scan transfer logs for the token on Ethereum and compute current balances.

        WARNING: this is *very* naive and only intended for demonstration/poc --
        walking the entire history from genesis may be slow, and in production you
        should rely on an indexer (The Graph, Alchemy, etc.) or a dedicated holder
        service. We also don't handle mint/burn hooks or reflect tokens.

        Returns a list of dicts with `address` and `balance` (as integer) sorted
        descending by balance. The returned list is truncated to `limit` items.
        """
        logger.info(f"Fetching holders for {token_address} on Ethereum using logs")

        # get all transfer logs (may take time depending on chain state)
        logs = await self.get_token_transfers(token_address, start_block=0)

        balances: dict[str, int] = {}
        transfer_signature = self.w3.keccak(text="Transfer(address,address,uint256)")

        for log in logs:
            # topics[1] = from, topics[2] = to
            # each topic is 32 bytes, address is right-padded
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

        # filter out non-positive balances
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
