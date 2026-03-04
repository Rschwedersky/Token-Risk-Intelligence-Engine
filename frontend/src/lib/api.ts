import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
});

export interface Token {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    chain: string;
    total_supply: string;
    circulating_supply: number;
    fdv?: number;
    market_cap?: number;
}

export interface TokenAnalytics {
    holder_count?: number;
    unique_holders_24h?: number;
    gini_coefficient?: number;
    whale_count?: number;
    whale_accumulation_score?: number;
    whale_movement_24h?: number;
    top_10_percentage?: number;
    top_100_percentage?: number;
    liquidity_dependency_ratio?: number;
    daily_active_wallets?: number;
    transfer_volume_24h?: number;
    unique_transfers_24h?: number;
    emission_pressure?: number;
    price_change_24h?: number;
    volume_24h?: number;
}

export interface TokenResponse {
    token: Token;
    analytics: TokenAnalytics | null;
    timestamp: string;
}

export interface Holder {
    holder_address: string;
    balance: string;
    percentage_of_supply: number;
    is_whale: boolean;
    is_contract: boolean;
    label?: string;
}

export interface HoldersResponse {
    data: Holder[];
    timestamp: string;
}

export interface AnalyticsHistoryItem extends TokenAnalytics {
    snapshot_date: string;
}

export interface HistoryResponse {
    data: AnalyticsHistoryItem[];
    timestamp: string;
}

// Token endpoints
export const tokenAPI = {
    getToken: async (address: string, chain: string): Promise<TokenResponse> => {
        const response = await api.get(`/api/v1/tokens/${address}/${chain}`);
        return response.data;
    },

    getHolders: async (
        address: string,
        chain: string,
        limit: number = 100
    ): Promise<HoldersResponse> => {
        const response = await api.get(`/api/v1/tokens/${address}/${chain}/holders`, {
            params: { limit },
        });
        return response.data;
    },

    getAnalyticsHistory: async (
        address: string,
        chain: string,
        days: number = 30
    ): Promise<HistoryResponse> => {
        const response = await api.get(
            `/api/v1/tokens/${address}/${chain}/history`,
            {
                params: { days },
            }
        );
        return response.data;
    },
};

// Health check
export const healthAPI = {
    check: async () => {
        const response = await api.get("/health");
        return response.data;
    },
};

export default api;
