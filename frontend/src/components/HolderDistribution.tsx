"use client";

import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { TokenAnalytics } from "@/lib/api";

interface HolderDistributionProps {
    analytics: TokenAnalytics | null | undefined;
}

export const HolderDistribution: React.FC<HolderDistributionProps> = ({ analytics }) => {
    if (!analytics) {
        return (
            <div className="bg-white rounded-lg p-6 shadow h-96 flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    const top10 = analytics.top_10_percentage || 0;
    const top100 = (analytics.top_100_percentage || 0) - top10;
    const rest = Math.max(0, 1 - ((analytics.top_100_percentage || 0)));

    const data = [
        { name: "Top 10", value: top10 * 100, fill: "#ef4444" },
        { name: "Top 11-100", value: top100 * 100, fill: "#f59e0b" },
        { name: "Rest", value: rest * 100, fill: "#10b981" },
    ].filter((item) => item.value > 0);

    return (
        <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4">Holder Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `${value.toFixed(2)}%`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
