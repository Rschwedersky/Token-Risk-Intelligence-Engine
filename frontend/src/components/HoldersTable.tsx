"use client";

import React, { useState, useEffect } from "react";
import { HoldersResponse } from "@/lib/api";
import { truncateAddress, formatNumber } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface HoldersTableProps {
    holders: HoldersResponse | null | undefined;
    chain?: string;
}

export const HoldersTable: React.FC<HoldersTableProps> = ({ holders, chain = "ethereum" }) => {
    const [sortKey, setSortKey] = useState<"balance" | "percentage">("balance");
    const [sortedHolders, setSortedHolders] = useState<any[]>([]);

    useEffect(() => {
        if (!holders) {
            setSortedHolders([]);
            return;
        }

        const sorted = [...holders.data].sort((a, b) => {
            if (sortKey === "balance") {
                return Number(BigInt(b.balance) - BigInt(a.balance));
            } else {
                return b.percentage_of_supply - a.percentage_of_supply;
            }
        });

        setSortedHolders(sorted.slice(0, 20)); // Top 20 holders
    }, [holders, sortKey]);

    if (!holders || holders.data.length === 0) {
        return (
            <div className="bg-white rounded-lg p-6 shadow">
                <h3 className="text-lg font-semibold mb-4">Top Holders</h3>
                <p className="text-gray-500">No holder data available</p>
            </div>
        );
    }

    const getExplorerUrl = (address: string) => {
        if (chain === "optimism") {
            return `https://optimistic.etherscan.io/address/${address}`;
        }
        return `https://etherscan.io/address/${address}`;
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Top 20 Holders</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSortKey("balance")}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${sortKey === "balance"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        By Balance
                    </button>
                    <button
                        onClick={() => setSortKey("percentage")}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${sortKey === "percentage"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        By %
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-3 font-semibold text-gray-700">#</th>
                            <th className="text-left py-3 px-3 font-semibold text-gray-700">Address</th>
                            <th className="text-right py-3 px-3 font-semibold text-gray-700">Balance</th>
                            <th className="text-right py-3 px-3 font-semibold text-gray-700">% of Supply</th>
                            <th className="text-center py-3 px-3 font-semibold text-gray-700">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedHolders.map((holder, index) => (
                            <tr
                                key={holder.holder_address}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-3 px-3 text-gray-700 font-medium">{index + 1}</td>
                                <td className="py-3 px-3">
                                    <a
                                        href={getExplorerUrl(holder.holder_address)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-mono text-xs"
                                    >
                                        {truncateAddress(holder.holder_address)}
                                        <ExternalLink size={14} className="flex-shrink-0" />
                                    </a>
                                </td>
                                <td className="py-3 px-3 text-right font-mono text-gray-700">
                                    {holder.balance && holder.balance.length > 15
                                        ? formatNumber(parseInt(holder.balance) / 1e18, 2)
                                        : formatNumber(parseInt(holder.balance || "0"), 2)}
                                </td>
                                <td className="py-3 px-3 text-right">
                                    <span
                                        className={`font-semibold ${holder.percentage_of_supply > 5
                                            ? "text-red-600"
                                            : holder.percentage_of_supply > 1
                                                ? "text-orange-600"
                                                : "text-green-600"
                                            }`}
                                    >
                                        {(holder.percentage_of_supply * 100).toFixed(4)}%
                                    </span>
                                </td>
                                <td className="py-3 px-3 text-center">
                                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                        {holder.is_contract ? "Contract" : "EOA"}
                                    </span>
                                    {holder.is_whale && (
                                        <span className="ml-2 inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                                            Whale
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
