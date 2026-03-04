import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Token Intelligence Dashboard",
    description: "On-chain token analytics, holder analysis, and risk metrics",
};


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geist.variable} ${geistMono.variable} antialiased bg-gray-50`} suppressHydrationWarning>
                <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">𝓣</span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Token Intelligence</h1>
                            </div>
                            <nav className="hidden md:flex items-center gap-8">
                                <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                                    Home
                                </a>
                                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                                    GitHub
                                </a>
                            </nav>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>

                <footer className="border-t border-gray-200 bg-white mt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">About</h3>
                                <p className="text-gray-600 text-sm">
                                    On-chain token intelligence dashboard with advanced analytics and holder distribution analysis.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Data Source</h3>
                                <p className="text-gray-600 text-sm">
                                    Real-time data from Ethereum and Optimism blockchains via Alchemy RPC endpoints.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Analytics</h3>
                                <p className="text-gray-600 text-sm">
                                    Gini coefficient, whale detection, liquidity analysis, and emission tracking.
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 pt-8 text-center text-gray-600 text-sm">
                            <p>&copy; 2025 Token Intelligence. Built with Next.js, FastAPI, and Web3.py</p>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}
