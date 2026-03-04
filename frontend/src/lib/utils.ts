/**
 * Format large numbers for display
 */
export const formatNumber = (num: number | string, decimals = 2): string => {
    const n = typeof num === "string" ? parseFloat(num) : num;

    if (isNaN(n)) return "0";
    if (n >= 1e9) return (n / 1e9).toFixed(decimals) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(decimals) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(decimals) + "K";
    return n.toFixed(decimals);
};

/**
 * Format percentage
 */
export const formatPercent = (value: number | undefined, decimals = 2): string => {
    if (value === undefined || isNaN(value)) return "0%";
    return (value * 100).toFixed(decimals) + "%";
};

/**
 * Format currency
 */
export const formatCurrency = (value: number | undefined, decimals = 2): string => {
    if (value === undefined || isNaN(value)) return "$0";
    return "$" + formatNumber(value, decimals);
};

/**
 * Get risk color based on score
 */
export const getRiskColor = (score: number): string => {
    if (score < 20) return "text-green-600";
    if (score < 40) return "text-yellow-600";
    if (score < 60) return "text-orange-600";
    return "text-red-600";
};

/**
 * Get risk background color based on score
 */
export const getRiskBgColor = (score: number): string => {
    if (score < 20) return "bg-green-100";
    if (score < 40) return "bg-yellow-100";
    if (score < 60) return "bg-orange-100";
    return "bg-red-100";
};

/**
 * Get risk label
 */
export const getRiskLabel = (score: number): string => {
    if (score < 20) return "Low Risk";
    if (score < 40) return "Moderate Risk";
    if (score < 60) return "High Risk";
    return "Critical Risk";
};

/**
 * Truncate address
 */
export const truncateAddress = (address: string, chars = 4): string => {
    if (!address) return "";
    return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

/**
 * Format date
 */
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
