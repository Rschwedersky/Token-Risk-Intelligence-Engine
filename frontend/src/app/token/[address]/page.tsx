"use client";

import React, { useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { useTokenStore } from "@/store/tokenStore";
import { tokenAPI } from "@/lib/api";
import { TokenHeader } from "@/components/TokenHeader";
import { MetricsGrid } from "@/components/MetricsGrid";
import { HolderDistribution } from "@/components/HolderDistribution";
import { AnalyticsTrend } from "@/components/AnalyticsTrend";
import { HoldersTable } from "@/components/HoldersTable";

export default function TokenDetailPage({
    params,
}: {
    params: Promise<{ address: string }>;
}) {
    // `params` is a promise returning the params object; React 18's `use`
    // helper unwraps it for us. this is required by Next.js in newer versions
    // to avoid warnings – direct access is deprecated.
    const { address } = use(params);
    const searchParams = useSearchParams();
    const chain = (searchParams.get("chain") as "ethereum" | "optimism") || "ethereum";

    const {
        selectedToken,
        holders,
        history,
        loading,
        error,
        setSelectedToken,
        setHolders,
        setHistory,
        setLoading,
        setError,
    } = useTokenStore();

    useEffect(() => {
        const fetchTokenData = async () => {
            if (selectedToken?.token.address === address) {
                // Already loaded
                return;
            }

            setLoading(true);
            setError("");

            try {
                // Fetch token data
                const tokenData = await tokenAPI.getToken(address, chain);
                setSelectedToken(tokenData);

                // Fetch holders data
                try {
                    const holdersData = await tokenAPI.getHolders(address, chain, 100);
                    setHolders(holdersData);
                } catch (err) {
                    console.warn("Failed to fetch holders:", err);
                }

                // Fetch history data
                try {
                    const historyData = await tokenAPI.getAnalyticsHistory(address, chain, 30);
                    setHistory(historyData);
                } catch (err) {
                    console.warn("Failed to fetch history:", err);
                }
            } catch (err: any) {
                const errorMessage = err.response?.data?.detail || err.message || "Failed to fetch token data";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchTokenData();
    }, [address, chain]);

    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
                    <p className="text-red-700">{error}</p>
                    <a
                        href="/"
                        className="mt-4 inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        Back to Search
                    </a>
                </div>
            </div>
        );
    }

    if (loading || !selectedToken) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow h-48 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading token data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <TokenHeader token={selectedToken} />

            {/* Metrics Grid */}
            <MetricsGrid analytics={selectedToken.analytics} />

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <HolderDistribution analytics={selectedToken.analytics} />
                <AnalyticsTrend history={history} />
            </div>

            {/* Holders Table */}
            <HoldersTable holders={holders} chain={chain} />

            {/* Footer */}
            <div className="bg-gray-100 rounded-lg p-6 mt-8">
                <h3 className="font-semibold text-gray-900 mb-2">📌 About These Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <div>
                        <p className="font-medium text-gray-900">Gini Coefficient (0-1)</p>
                        <p>Measures wealth inequality. 0 = all holders equal balance, 1 = one holder owns all tokens.</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Whale Accumulation Score (0-100)</p>
                        <p>Risk metric based on top 10 holder concentration. Higher = more concentrated = higher risk.</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Liquidity Ratio</p>
                        <p>TVL / Market Cap. Lower ratios indicate liquidity concentration risk.</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">Emission Pressure</p>
                        <p>Daily new emissions as percentage of circulating supply. Indicates inflation/dilution.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
