/* ===================================
   MAIN APPLICATION
   UI Control and Event Handling
   =================================== */

class App {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 Portfolio Tracker initializing...');
        
        // Initialize charts
        chartsManager.init();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initial render
        this.render();
        
        console.log('✅ Portfolio Tracker ready!');
    }

    setupEventListeners() {
        // Add position form
        const form = document.getElementById('addPositionForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleAddPosition(e));
        }

        // Clear portfolio button
        const clearBtn = document.getElementById('clearPortfolio');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.handleClearPortfolio());
        }
    }

    handleAddPosition(e) {
        e.preventDefault();
        
        const ticker = document.getElementById('ticker').value;
        const shares = document.getElementById('shares').value;
        const purchasePrice = document.getElementById('purchasePrice').value;
        const assetClass = document.getElementById('assetClass').value;

        // Add position
        portfolioManager.addPosition(ticker, shares, purchasePrice, assetClass);
        
        // Reset form
        e.target.reset();
        
        // Re-render
        this.render();
        
        console.log(`✅ Added position: ${ticker}`);
    }

    handleRemovePosition(id) {
        if (confirm('Are you sure you want to remove this position?')) {
            portfolioManager.removePosition(id);
            this.render();
            console.log(`🗑️ Removed position`);
        }
    }

    handleClearPortfolio() {
        if (confirm('Are you sure you want to clear ALL positions? This cannot be undone.')) {
            portfolioManager.clearAll();
            this.render();
            console.log('🗑️ Portfolio cleared');
        }
    }

    render() {
        this.renderSummary();
        this.renderHoldingsTable();
        chartsManager.refresh();
    }

    renderSummary() {
        const metrics = portfolioManager.calculateMetrics();
        
        // Total Value
        document.getElementById('totalValue').textContent = 
            this.formatCurrency(metrics.totalCurrentValue);
        
        const changeEl = document.getElementById('totalChange');
        changeEl.textContent = 
            `${metrics.totalGainLoss >= 0 ? '+' : ''}${this.formatCurrency(metrics.totalGainLoss)} (${metrics.totalReturnPct.toFixed(2)}%)`;
        changeEl.className = `metric-change ${metrics.totalGainLoss >= 0 ? 'positive' : 'negative'}`;
        
        // Total Invested
        document.getElementById('totalInvested').textContent = 
            this.formatCurrency(metrics.totalInvested);
        
        // Total Return
        document.getElementById('totalReturn').textContent = 
            `${metrics.totalReturnPct >= 0 ? '+' : ''}${metrics.totalReturnPct.toFixed(2)}%`;
        
        const returnAmountEl = document.getElementById('returnAmount');
        returnAmountEl.textContent = 
            `${metrics.totalGainLoss >= 0 ? '+' : ''}${this.formatCurrency(metrics.totalGainLoss)}`;
        returnAmountEl.className = `metric-change ${metrics.totalGainLoss >= 0 ? 'positive' : 'negative'}`;
        
        // Holdings Count
        document.getElementById('totalHoldings').textContent = metrics.holdingsCount;
    }

    renderHoldingsTable() {
        const metrics = portfolioManager.calculateMetrics();
        const tbody = document.getElementById('holdingsTableBody');
        const emptyState = document.getElementById('emptyState');
        
        if (metrics.positions.length === 0) {
            tbody.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }
        
        emptyState.classList.add('hidden');
        
        tbody.innerHTML = metrics.positions.map(position => {
            const allocationPct = metrics.totalCurrentValue > 0 
                ? (position.currentValue / metrics.totalCurrentValue * 100).toFixed(1)
                : 0;
            
            return `
                <tr>
                    <td class="ticker-cell">${position.ticker}</td>
                    <td>${this.formatAssetClass(position.assetClass)}</td>
                    <td>${this.formatNumber(position.shares)}</td>
                    <td>${this.formatCurrency(position.purchasePrice)}</td>
                    <td>${this.formatCurrency(position.currentPrice)}</td>
                    <td>${this.formatCurrency(position.costBasis)}</td>
                    <td>${this.formatCurrency(position.currentValue)}</td>
                    <td class="${position.gainLoss >= 0 ? 'positive' : 'negative'}">
                        ${position.gainLoss >= 0 ? '+' : ''}${this.formatCurrency(position.gainLoss)}
                    </td>
                    <td class="${position.returnPct >= 0 ? 'positive' : 'negative'}">
                        ${position.returnPct >= 0 ? '+' : ''}${position.returnPct.toFixed(2)}%
                    </td>
                    <td>${allocationPct}%</td>
                    <td>
                        <button class="btn btn-danger" onclick="app.handleRemovePosition('${position.id}')">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Utility formatters
    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    formatNumber(value) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 8
        }).format(value);
    }

    formatAssetClass(assetClass) {
        return assetClass.charAt(0).toUpperCase() + assetClass.slice(1);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
