"use client";

import React from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { HistoryResponse } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface AnalyticsTrendProps {
    history: HistoryResponse | null | undefined;
}

export const AnalyticsTrend: React.FC<AnalyticsTrendProps> = ({ history }) => {
    if (!history || history.data.length === 0) {
        return (
            <div className="bg-white rounded-lg p-6 shadow h-96 flex items-center justify-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    const data = history.data.map((item) => ({
        date: new Date(item.snapshot_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
        gini: ((item.gini_coefficient || 0) * 100).toFixed(2),
        whale: item.whale_accumulation_score || 0,
    }));

    return (
        <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-semibold mb-4">Analytics Trends (30 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                    />
                    <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                        label={{ value: "Gini Coefficient (%)", angle: -90, position: "insideLeft" }}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                        label={{ value: "Whale Score", angle: 90, position: "insideRight" }}
                    />
                    <Tooltip
                        formatter={(value: any) => {
                            if (typeof value === "string") {
                                return [value, ""];
                            }
                            return value.toFixed(2);
                        }}
                        contentStyle={{
                            backgroundColor: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.375rem",
                        }}
                    />
                    <Legend />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="gini"
                        stroke="#3b82f6"
                        name="Gini Coefficient (%)"
                        isAnimationActive={false}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="whale"
                        stroke="#ef4444"
                        name="Whale Score"
                        isAnimationActive={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
