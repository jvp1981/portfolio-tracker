/* ===================================
   PORTFOLIO DATA MANAGER
   Handles all portfolio data operations
   =================================== */

class PortfolioManager {
    constructor() {
        this.positions = [];
        this.loadFromStorage();
    }

    // Load portfolio from localStorage
    loadFromStorage() {
        const saved = localStorage.getItem('portfolioPositions');
        if (saved) {
            try {
                this.positions = JSON.parse(saved);
            } catch (error) {
                console.error('Error loading portfolio:', error);
                this.positions = [];
            }
        }
    }

    // Save portfolio to localStorage
    saveToStorage() {
        try {
            localStorage.setItem('portfolioPositions', JSON.stringify(this.positions));
        } catch (error) {
            console.error('Error saving portfolio:', error);
        }
    }

    // Add new position
    addPosition(ticker, shares, purchasePrice, assetClass) {
        const position = {
            id: Date.now().toString(),
            ticker: ticker.toUpperCase(),
            shares: parseFloat(shares),
            purchasePrice: parseFloat(purchasePrice),
            assetClass: assetClass,
            dateAdded: new Date().toISOString()
        };

        this.positions.push(position);
        this.saveToStorage();
        return position;
    }

    // Remove position by ID
    removePosition(id) {
        this.positions = this.positions.filter(pos => pos.id !== id);
        this.saveToStorage();
    }

    // Clear all positions
    clearAll() {
        this.positions = [];
        this.saveToStorage();
    }

    // Get all positions
    getPositions() {
        return this.positions;
    }

// Get current price (mock data for MVP - will be API later)
    getCurrentPrice(ticker) {
        // Mock price data - simulates price movement
        const mockPrices = {
            // Tech Stocks
            'AAPL': 178.50,
            'GOOGL': 142.30,
            'MSFT': 378.90,
            'AMZN': 155.20,
            'META': 485.60,
            'TSLA': 248.70,
            'NVDA': 495.30,
            'AMD': 178.40,
            'NFLX': 485.20,
            'ORCL': 112.30,
            
            // Finance
            'JPM': 168.50,
            'BAC': 34.20,
            'GS': 385.40,
            'MS': 92.30,
            'V': 265.80,
            
            // Crypto
            'BTC-USD': 43250.00,
            'ETH-USD': 2280.50,
            'SOL-USD': 98.30,
            'BNB-USD': 315.40,
            
            // ETFs
            'SPY': 478.90,
            'QQQ': 408.20,
            'IWM': 198.50,
            'VTI': 235.60,
            'VOO': 442.30,
            'DIA': 385.70,
            
            // Commodities
            'GLD': 198.40,
            'SLV': 22.80,
            'USO': 75.30,
            
            // Bonds
            'TLT': 92.30,
            'IEF': 98.50,
            'AGG': 101.20,
            
            // International
            'EEM': 41.20,
            'VEA': 48.90,
            'VWO': 42.30
        };

        // If we have a mock price, add random fluctuation ±3%
        if (mockPrices[ticker]) {
            const basePrice = mockPrices[ticker];
            const fluctuation = (Math.random() - 0.5) * 0.06; // ±3%
            return basePrice * (1 + fluctuation);
        }

        // For unknown tickers, use purchase price +/- random %
        const position = this.positions.find(p => p.ticker === ticker);
        if (position) {
            const fluctuation = (Math.random() - 0.5) * 0.20; // ±10%
            return position.purchasePrice * (1 + fluctuation);
        }

        return 0;
    }

    // Calculate portfolio metrics
        calculateMetrics() {
            let totalInvested = 0;
            let totalCurrentValue = 0;
            let totalDebt = 0;
            const positionsWithValues = [];

            this.positions.forEach(position => {
                let currentPrice, costBasis, currentValue, gainLoss, returnPct;
                
                // Special handling for Loans
                if (position.assetClass === 'loan') {
                    // For loans, use the purchase price as-is (should be negative)
                    // No price fluctuation for loans
                    currentPrice = position.purchasePrice;
                    costBasis = position.shares * position.purchasePrice;
                    currentValue = costBasis; // Loans don't appreciate
                    gainLoss = 0; // No gain/loss on debt
                    returnPct = 0;
                    
                    totalDebt += Math.abs(costBasis); // Track total debt
                } else {
                    // Normal assets
                    currentPrice = this.getCurrentPrice(position.ticker);
                    costBasis = position.shares * position.purchasePrice;
                    currentValue = position.shares * currentPrice;
                    gainLoss = currentValue - costBasis;
                    returnPct = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;
                }

                totalInvested += costBasis;
                totalCurrentValue += currentValue;

                positionsWithValues.push({
                    ...position,
                    currentPrice: currentPrice,
                    costBasis: costBasis,
                    currentValue: currentValue,
                    gainLoss: gainLoss,
                    returnPct: returnPct
                });
            });

            const totalGainLoss = totalCurrentValue - totalInvested;
            const totalReturnPct = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;
            
            // Calculate leverage
            const netWorth = totalCurrentValue;
            const leveragePct = netWorth > 0 ? (totalDebt / netWorth) * 100 : 0;

            return {
                totalInvested,
                totalCurrentValue,
                totalGainLoss,
                totalReturnPct,
                totalDebt,
                netWorth,
                leveragePct,
                positions: positionsWithValues,
                holdingsCount: this.positions.length
            };
        }

    // Get asset allocation
    getAssetAllocation() {
        const metrics = this.calculateMetrics();
        const allocation = {};

        metrics.positions.forEach(position => {
            if (!allocation[position.assetClass]) {
                allocation[position.assetClass] = 0;
            }
            allocation[position.assetClass] += position.currentValue;
        });

        return allocation;
    }

    // Get top holdings
    getTopHoldings(limit = 5) {
        const metrics = this.calculateMetrics();
        return metrics.positions
            .sort((a, b) => b.currentValue - a.currentValue)
            .slice(0, limit);
    }
}

// Create global instance
const portfolioManager = new PortfolioManager();
