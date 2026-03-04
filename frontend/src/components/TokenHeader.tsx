"use client";

import React from "react";
import { TokenResponse } from "@/lib/api";
import { truncateAddress, formatCurrency } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface TokenHeaderProps {
    token: TokenResponse | null | undefined;
}

export const TokenHeader: React.FC<TokenHeaderProps> = ({ token }) => {
    const [copied, setCopied] = useState(false);

    if (!token) {
        return (
            <div className="bg-white rounded-lg p-6 shadow h-32 flex items-center justify-center">
                <p className="text-gray-500">No token selected</p>
            </div>
        );
    }

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(token.token.address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 shadow-lg">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h1 className="text-4xl font-bold">{token.token.symbol}</h1>
                    <p className="text-blue-100 text-lg">{token.token.name}</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold">{formatCurrency(token.token.market_cap || 0)}</div>
                    <p className="text-blue-100 text-sm">Market Cap</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <p className="text-blue-100 text-sm">Total Supply</p>
                    <p className="text-xl font-semibold">
                        {(
                            parseInt(token.token.total_supply || "0") /
                            Math.pow(10, token.token.decimals)
                        ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                </div>
                <div>
                    <p className="text-blue-100 text-sm">Circulating Supply</p>
                    <p className="text-xl font-semibold">
                        {(
                            token.token.circulating_supply /
                            Math.pow(10, token.token.decimals)
                        ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                </div>
                <div>
                    <p className="text-blue-100 text-sm">Chain</p>
                    <p className="text-xl font-semibold capitalize">{token.token.chain}</p>
                </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
                <p className="text-blue-100 text-sm">Contract Address:</p>
                <code className="bg-blue-900 bg-opacity-50 px-3 py-1 rounded text-sm font-mono">
                    {truncateAddress(token.token.address, 6)}
                </code>
                <button
                    onClick={handleCopyAddress}
                    className="ml-2 p-1 hover:bg-blue-700 rounded transition-colors"
                    title="Copy full address"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
            </div>
        </div>
    );
};
