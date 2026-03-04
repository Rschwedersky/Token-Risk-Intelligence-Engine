import { create } from "zustand";
import { TokenResponse, HoldersResponse, HistoryResponse } from "@/lib/api";

export interface TokenStore {
    selectedToken: TokenResponse | null;
    holders: HoldersResponse | null;
    history: HistoryResponse | null;
    loading: boolean;
    error: string | null;

    setSelectedToken: (token: TokenResponse | null) => void;
    setHolders: (holders: HoldersResponse | null) => void;
    setHistory: (history: HistoryResponse | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clear: () => void;
}

export const useTokenStore = create<TokenStore>((set) => ({
    selectedToken: null,
    holders: null,
    history: null,
    loading: false,
    error: null,

    setSelectedToken: (token) => set({ selectedToken: token }),
    setHolders: (holders) => set({ holders }),
    setHistory: (history) => set({ history }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clear: () => set({
        selectedToken: null,
        holders: null,
        history: null,
        error: null,
    }),
}));
