"use client";

import React from "react";
import { SearchBar } from "@/components/SearchBar";

export default function Home() {
    return (
        <div className="space-y-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Analyze Any Token on-chain
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Get comprehensive holder distribution analysis, whale detection, liquidity metrics, and risk assessment in real-time.
                </p>
            </div>

            <SearchBar />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Holder Analytics</h3>
                    <p className="text-gray-600">
                        Analyze token holder distribution, identify whales, and track concentration metrics.
                    </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">📈</span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Gini Coefficient</h3>
                    <p className="text-gray-600">
                        Measure supply distribution inequality using advanced statistical methods.
                    </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">Risk Assessment</h3>
                    <p className="text-gray-600">
                        Comprehensive risk scoring based on concentration, whale activity, and liquidity.
                    </p>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Pro Tip</h3>
                <p className="text-blue-800">
                    Search for any ERC-20 token on Ethereum or Optimism. The dashboard will fetch on-chain data and display comprehensive analytics including holder distribution, risk metrics, and historical trends.
                </p>
            </div>
        </div>
    );
}
