"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { tokenAPI } from "@/lib/api";
import { useTokenStore } from "@/store/tokenStore";

export const SearchBar: React.FC = () => {
    const router = useRouter();
    const [address, setAddress] = useState("");
    const [chain, setChain] = useState<"ethereum" | "optimism">("ethereum");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { setSelectedToken, setLoading: setStoreLoading, setError: setStoreError } = useTokenStore();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validate address format
        if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
            setError("Invalid Ethereum address format");
            return;
        }

        try {
            setLoading(true);
            setStoreLoading(true);

            const response = await tokenAPI.getToken(address, chain);
            setSelectedToken(response);

            // Navigate to token detail page
            router.push(`/token/${address}?chain=${chain}`);
        } catch (err: any) {
            const errorMessage = err.response?.data?.detail || err.message || "Failed to fetch token";
            setError(errorMessage);
            setStoreError(errorMessage);
        } finally {
            setLoading(false);
            setStoreLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-2xl font-bold mb-6">Token Analytics</h2>
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Token Address
                        </label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chain
                        </label>
                        <select
                            value={chain}
                            onChange={(e) => setChain(e.target.value as "ethereum" | "optimism")}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option value="ethereum">Ethereum</option>
                            <option value="optimism">Optimism</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    {loading ? "Analyzing Token..." : "Analyze Token"}
                </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                    <strong>Example addresses:</strong>
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                    <li className="text-gray-600">
                        Uniswap (UNI): <code className="bg-gray-100 px-2 py-1 rounded">0x1f9840a85d5af5bf1d1762f925bdaddc4201f984</code>
                    </li>
                    <li className="text-gray-600">
                        Aave (AAVE): <code className="bg-gray-100 px-2 py-1 rounded">0x7fc66500c84a76ad7e9c93437e434122a1daed11</code>
                    </li>
                </ul>
            </div>
        </div>
    );
};
