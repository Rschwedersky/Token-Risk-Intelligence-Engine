"use client";

import React from "react";
import { TokenAnalytics } from "@/lib/api";
import { formatNumber, formatPercent, getRiskColor, getRiskBgColor, getRiskLabel } from "@/lib/utils";

interface MetricsGridProps {
    analytics: TokenAnalytics | null | undefined;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ analytics }) => {
    if (!analytics) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-slate-200 h-32 rounded-lg animate-pulse" />
                ))}
            </div>
        );
    }

    const riskScore = analytics.whale_accumulation_score || 0;
    const riskColor = getRiskColor(riskScore);
    const riskBg = getRiskBgColor(riskScore);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Holder Count */}
            <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-2">Holder Count</p>
                <p className="text-2xl font-bold">
                    {analytics.holder_count ? formatNumber(analytics.holder_count, 0) : "-"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    24h active: {analytics.unique_holders_24h || 0}
                </p>
            </div>

            {/* Gini Coefficient */}
            <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-2">Distribution (Gini)</p>
                <p className="text-2xl font-bold">
                    {analytics.gini_coefficient !== undefined ? (analytics.gini_coefficient * 100).toFixed(1) : "-"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    {analytics.gini_coefficient && analytics.gini_coefficient > 0.7
                        ? "⚠️ Highly concentrated"
                        : "✓ Well distributed"}
                </p>
            </div>

            {/* Top 10 Holders */}
            <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-2">Top 10 Holders</p>
                <p className="text-2xl font-bold">
                    {analytics.top_10_percentage
                        ? (analytics.top_10_percentage * 100).toFixed(1)
                        : "-"}
                    %
                </p>
                <p className="text-xs text-gray-500 mt-2">of total supply</p>
            </div>

            {/* Whale Risk Score */}
            <div className={`rounded-lg p-4 shadow ${riskBg}`}>
                <p className="text-sm text-gray-600 mb-2">Whale Risk</p>
                <p className={`text-2xl font-bold ${riskColor}`}>{riskScore.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-2">{getRiskLabel(riskScore)}</p>
            </div>

            {/* Daily Active Wallets */}
            <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-2">Active Wallets (24h)</p>
                <p className="text-2xl font-bold">
                    {analytics.daily_active_wallets ? formatNumber(analytics.daily_active_wallets, 0) : "-"}
                </p>
                <p className="text-xs text-gray-500 mt-2">transfers</p>
            </div>

            {/* Liquidity Ratio */}
            <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-2">Liquidity Ratio</p>
                <p className="text-2xl font-bold">
                    {analytics.liquidity_dependency_ratio
                        ? (analytics.liquidity_dependency_ratio * 100).toFixed(1)
                        : "-"}
                    %
                </p>
                <p className="text-xs text-gray-500 mt-2">TVL / Market Cap</p>
            </div>

            {/* Emission Pressure */}
            <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-2">Emission Pressure</p>
                <p className="text-2xl font-bold">
                    {analytics.emission_pressure
                        ? (analytics.emission_pressure * 100).toFixed(2)
                        : "0"}
                    %
                </p>
                <p className="text-xs text-gray-500 mt-2">daily</p>
            </div>

            {/* 24h Price Change */}
            <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-sm text-gray-600 mb-2">24h Price Change</p>
                <p
                    className={`text-2xl font-bold ${analytics.price_change_24h && analytics.price_change_24h > 0
                        ? "text-green-600"
                        : "text-red-600"
                        }`}
                >
                    {analytics.price_change_24h ? (analytics.price_change_24h > 0 ? "+" : "") + analytics.price_change_24h.toFixed(2) : "-"}
                    %
                </p>
            </div>
        </div>
    );
};
