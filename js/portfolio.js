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
            'AAPL': 178.50,
            'GOOGL': 142.30,
            'MSFT': 378.90,
            'AMZN': 155.20,
            'META': 485.60,
            'TSLA': 248.70,
            'NVDA': 495.30,
            'BTC-USD': 43250.00,
            'ETH-USD': 2280.50,
            'SPY': 478.90,
            'QQQ': 408.20,
            'GLD': 198.40,
            'TLT': 92.30
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
        const positionsWithValues = [];

        this.positions.forEach(position => {
            const currentPrice = this.getCurrentPrice(position.ticker);
            const costBasis = position.shares * position.purchasePrice;
            const currentValue = position.shares * currentPrice;
            const gainLoss = currentValue - costBasis;
            const returnPct = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;

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

        return {
            totalInvested,
            totalCurrentValue,
            totalGainLoss,
            totalReturnPct,
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
