"""
Token analytics and metrics engine.
Calculates advanced metrics like Gini coefficient, whale accumulation score, etc.
"""

import numpy as np
from typing import List, Dict, Tuple
import logging

logger = logging.getLogger(__name__)


class TokenAnalyticsEngine:
    """Compute advanced token metrics."""

    @staticmethod
    def calculate_gini_coefficient(balances: List[float]) -> float:
        """
        Calculate Gini coefficient for holder distribution.
        0 = Perfect equality, 1 = Complete inequality
        """
        if not balances or len(balances) < 2:
            return 0.0

        sorted_balances = np.array(sorted(balances))
        n = len(sorted_balances)
        cumsum = np.cumsum(sorted_balances)

        # Gini formula
        gini = (2 * np.sum(cumsum)) / (n * cumsum[-1]) - (n + 1) / n
        return float(np.clip(gini, 0, 1))

    @staticmethod
    def calculate_whale_accumulation_score(
        top_holders: List[float], total_supply: float
    ) -> float:
        """
        Calculate whale accumulation score (0-100).
        Measures concentration risk among large holders.

        Scoring:
        - <10% top 10: 10 (low risk)
        - 10-30% top 10: 30-50 (moderate)
        - 30-50% top 10: 50-80 (high risk)
        - >50% top 10: 100 (critical)
        """
        if not top_holders or total_supply == 0:
            return 0.0

        concentration = sum(top_holders) / total_supply

        if concentration < 0.10:
            return 10.0
        elif concentration < 0.30:
            return 20.0 + (concentration - 0.10) * 100
        elif concentration < 0.50:
            return 50.0 + (concentration - 0.30) * 150
        else:
            return min(100.0, 80.0 + (concentration - 0.50) * 400)

    @staticmethod
    def calculate_liquidity_dependency_ratio(
        total_liquidity_usd: float, market_cap_usd: float
    ) -> float:
        """
        Calculate liquidity dependency ratio.
        TVL / Market Cap. Higher = more dependent on liquidity, higher slippage risk.

        Example: If TVL = $10M and Market Cap = $100M, ratio = 0.1 (10%)
        """
        if market_cap_usd == 0:
            return 0.0
        return total_liquidity_usd / market_cap_usd

    @staticmethod
    def calculate_emission_pressure(
        daily_emissions: float, circulating_supply: float
    ) -> float:
        """
        Calculate emission pressure as percentage of circulating supply.

        Example: 1M tokens emitted per day on 100M circulating = 1% daily pressure
        """
        if circulating_supply == 0:
            return 0.0
        return (daily_emissions / circulating_supply) * 100

    @staticmethod
    def analyze_holder_distribution(holders_data: List[Dict]) -> Dict:
        """
        Comprehensive holder analysis.

        Args:
            holders_data: List of dicts with 'address' and 'balance' keys

        Returns:
            Dict with various metrics
        """
        if not holders_data:
            return {}

        balances = [h["balance"] for h in holders_data]
        sorted_balances = sorted(balances, reverse=True)
        total_supply = sum(balances)

        # Calculate percentiles
        top_10 = sorted_balances[:10]
        top_100 = sorted_balances[:100]

        top_10_pct = (sum(top_10) / total_supply * 100) if total_supply > 0 else 0
        top_100_pct = (sum(top_100) / total_supply * 100) if total_supply > 0 else 0

        # Identify whales (>1% of supply)
        whale_threshold = total_supply * 0.01
        whales = [b for b in balances if b > whale_threshold]

        gini = TokenAnalyticsEngine.calculate_gini_coefficient(balances)
        whale_score = TokenAnalyticsEngine.calculate_whale_accumulation_score(
            top_10, total_supply
        )

        return {
            "holder_count": len(holders_data),
            "unique_holders": len(set(h["address"] for h in holders_data)),
            "total_supply": total_supply,
            "top_10_percentage": round(top_10_pct, 2),
            "top_100_percentage": round(top_100_pct, 2),
            "gini_coefficient": round(gini, 4),
            "whale_count": len(whales),
            "whale_accumulation_score": round(whale_score, 2),
            "average_holder_balance": round(total_supply / len(holders_data), 2),
            "median_holder_balance": round(np.median(balances), 2),
        }

    @staticmethod
    def calculate_whale_movement_score(
        previous_holders: Dict[str, float], current_holders: Dict[str, float]
    ) -> float:
        """
        Calculate whale movement score (buying vs selling).

        Positive score = net accumulation (bullish)
        Negative score = net distribution (bearish)
        """
        if not previous_holders or not current_holders:
            return 0.0

        all_whales = set(previous_holders.keys()) | set(current_holders.keys())
        whale_threshold = (
            max(max(previous_holders.values()), max(current_holders.values())) * 0.01
        )

        whales = {
            w
            for w in all_whales
            if previous_holders.get(w, 0) > whale_threshold
            or current_holders.get(w, 0) > whale_threshold
        }

        if not whales:
            return 0.0

        net_change = sum(
            current_holders.get(whale, 0) - previous_holders.get(whale, 0)
            for whale in whales
        )

        total_whale_holdings = sum(previous_holders.values())

        if total_whale_holdings == 0:
            return 0.0

        movement_percentage = (net_change / total_whale_holdings) * 100
        return round(movement_percentage, 2)

    @staticmethod
    def calculate_risk_metrics(analytics_data: Dict) -> Dict:
        """
        Generate composite risk metrics based on all analytics.

        Returns a risk score (0-100) and individual risk factors.
        """
        risks = []
        factors = {}

        # Gini coefficient risk (0-25 points)
        gini = analytics_data.get("gini_coefficient", 0)
        gini_risk = min(25, gini * 25)
        risks.append(gini_risk)
        factors["concentration_risk"] = round(gini_risk, 2)

        # Whale risk (0-25 points)
        whale_score = analytics_data.get("whale_accumulation_score", 0)
        whale_risk = min(25, whale_score)
        risks.append(whale_risk)
        factors["whale_risk"] = round(whale_risk, 2)

        # Liquidity risk (0-25 points)
        liquidity_ratio = analytics_data.get("liquidity_dependency_ratio", 1)
        liquidity_risk = (
            min(25, (1 - liquidity_ratio) * 25) if liquidity_ratio > 0 else 25
        )
        risks.append(liquidity_risk)
        factors["liquidity_risk"] = round(liquidity_risk, 2)

        # Emission pressure risk (0-25 points)
        emission_pressure = analytics_data.get("emission_pressure", 0)
        emission_risk = min(25, emission_pressure * 0.25)
        risks.append(emission_risk)
        factors["emission_risk"] = round(emission_risk, 2)

        overall_risk = sum(risks) / len(risks)

        return {
            "overall_risk_score": round(overall_risk, 2),
            "risk_factors": factors,
        }
