/* ===================================
   MAIN APPLICATION
   UI Control and Event Handling
   =================================== */

class App {
    constructor() {
        // Auto-refresh state
        this.autoRefreshEnabled = false;
        this.autoRefreshInterval = null;
        this.countdownInterval = null;
        this.nextRefreshTime = null;
        this.refreshIntervalMinutes = 5; // 5 minutes
        
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
        
        // Update timestamp every second
                setInterval(() => {
                    this.updateLastUpdated();
                }, 1000);
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

        // Refresh prices button
                const refreshBtn = document.getElementById('refreshPrices');
                if (refreshBtn) {
                    refreshBtn.addEventListener('click', () => this.handleRefreshPrices());
                }

        // Toggle auto-refresh button
                const toggleAutoRefreshBtn = document.getElementById('toggleAutoRefresh');
                if (toggleAutoRefreshBtn) {
                    toggleAutoRefreshBtn.addEventListener('click', () => this.handleToggleAutoRefresh());
                }

        // Fetch real prices button
                const fetchRealBtn = document.getElementById('fetchRealPrices');
                if (fetchRealBtn) {
                    fetchRealBtn.addEventListener('click', () => this.handleFetchRealPrices());
                }

        // Clear cache button
                const clearCacheBtn = document.getElementById('clearCache');
                if (clearCacheBtn) {
                    clearCacheBtn.addEventListener('click', () => this.handleClearCache());
                }

        // Export portfolio button
        const exportBtn = document.getElementById('exportPortfolio');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.handleExportPortfolio());
        }

        // Import portfolio button
        const importBtn = document.getElementById('importPortfolio');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.handleImportPortfolio());
        }

        // File input for import
        const fileInput = document.getElementById('importFileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelected(e));
        }
    
        // Navigation buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // Settings button
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.handleSettings());
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
            // Find the position to get details
            const position = portfolioManager.getPositions().find(p => p.id === id);
            
            if (!position) {
                alert('Position not found');
                return;
            }
            
            // Calculate current value
            const metrics = portfolioManager.calculateMetrics();
            const positionWithValue = metrics.positions.find(p => p.id === id);
            
            // Build confirmation message
            const message = `Delete ${position.ticker}?

    This will remove:
    - ${this.formatNumber(position.shares)} shares
    - Current value: ${this.formatCurrency(positionWithValue.currentValue)}
    - ${positionWithValue.gainLoss >= 0 ? 'Gain' : 'Loss'}: ${this.formatCurrency(Math.abs(positionWithValue.gainLoss))}

    This action cannot be undone.`;
            
            if (confirm(message)) {
                portfolioManager.removePosition(id);
                this.render();
                console.log(`🗑️ Removed position: ${position.ticker}`);
            }
        }

        handleClearPortfolio() {
                const metrics = portfolioManager.calculateMetrics();
                const count = metrics.holdingsCount;
                
                if (count === 0) {
                    alert('Portfolio is already empty');
                    return;
                }
                
                const message = `Clear ALL positions?

        This will permanently delete:
        - ${count} position${count > 1 ? 's' : ''}
        - Total value: ${this.formatCurrency(metrics.totalCurrentValue)}

        This action cannot be undone.`;
                
                if (confirm(message)) {
                    portfolioManager.clearAll();
                    this.render();
                    console.log('🗑️ Portfolio cleared');
                }
            }

    handleClearCache() {
        priceAPI.clearCache();
        coinGeckoAPI.clearCache();
        
        // Clear realPrice from all positions
        portfolioManager.positions.forEach(position => {
            delete position.realPrice;
        });
        portfolioManager.saveToStorage();
        
        this.render();
        
        alert('🗑️ Cache cleared!\n\nAll prices reset to mock data.\nClick "Fetch Real Prices" to get fresh data.');
        console.log('🗑️ All caches cleared');
    }
    
    handleRefreshPrices() {
            // Simply re-render - getCurrentPrice() generates new random prices
            this.render();
            
            // Optional: Show feedback
            console.log('🔄 Prices refreshed');
            
            // Optional: Brief visual feedback
            const btn = document.getElementById('refreshPrices');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = '✅ Refreshed!';
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 1000);
            }
        }
        async handleFetchRealPrices() {
                const btn = document.getElementById('fetchRealPrices');
                if (!btn) return;

                const loadingOverlay = document.getElementById('loadingOverlay');

                try {
                    // Show loading overlay
                    if (loadingOverlay) {
                        loadingOverlay.classList.remove('hidden');
                    }

                    // Disable button
                    btn.disabled = true;
                    btn.innerHTML = '⏳ Fetching...';

                    // Clear caches to force fresh data
                    priceAPI.clearCache();
                    coinGeckoAPI.clearCache();
                    console.log('🗑️ Caches cleared - fetching fresh prices...');

                    // Fetch real prices
                    const prices = await portfolioManager.fetchRealPrices();

                    // Update positions with real prices
                    let updatedCount = 0;
                    
                    portfolioManager.positions.forEach(position => {
                        if (prices[position.ticker] !== null && prices[position.ticker] !== undefined) {
                            // Save current realPrice as lastPrice BEFORE updating
                            if (position.realPrice !== undefined && position.realPrice !== null) {
                                position.lastPrice = position.realPrice;
                            }
                            // Update to new price
                            position.realPrice = prices[position.ticker];
                            updatedCount++;
                            console.log(`💾 ${position.ticker}: realPrice=${position.realPrice}, lastPrice=${position.lastPrice || 'none'}`);
                        }
                    });

                    // Save to localStorage
                    portfolioManager.saveToStorage();

                    // Re-render
                    this.render();

                    // Hide loading overlay
                    if (loadingOverlay) {
                        loadingOverlay.classList.add('hidden');
                    }

                    // Show result with breakdown
                    const cryptoCount = Object.keys(prices).filter(ticker => 
                        coinGeckoAPI.isCrypto(ticker) && prices[ticker] !== null
                    ).length;

                    const stockCount = Object.keys(prices).filter(ticker => 
                        !coinGeckoAPI.isCrypto(ticker) && prices[ticker] !== null
                    ).length;

                    const failedCount = Object.values(prices).filter(p => p === null).length;

                    let message = `✅ Updated ${updatedCount} real prices!\n\n`;
                    message += `🪙 Crypto: ${cryptoCount} (CoinGecko)\n`;
                    message += `📈 Stocks: ${stockCount} (Alpha Vantage)\n`;

                    if (failedCount > 0) {
                        message += `\n⚠️ ${failedCount} failed (using mock prices)\n`;
                        message += `Tip: Alpha Vantage has 25 requests/day limit.`;
                    }

                    alert(message);
                    console.log('✅ Real prices fetched:', prices);

                    // Reset button
                    btn.innerHTML = '✅ Prices Updated';
                    setTimeout(() => {
                        btn.innerHTML = '📡 Fetch Real Prices';
                        btn.disabled = false;
                    }, 2000);

                } catch (error) {
                    // Hide loading overlay
                    if (loadingOverlay) {
                        loadingOverlay.classList.add('hidden');
                    }

                    console.error('Error fetching real prices:', error);
                    alert('❌ Error fetching prices: ' + error.message);
                    
                    // Reset button
                    btn.innerHTML = '📡 Fetch Real Prices';
                    btn.disabled = false;
                }
            }

        render() {
                this.renderSummary();
                this.renderHoldingsTable();
                chartsManager.refresh();
                this.updateLastUpdated();
            }

            renderSummary() {
                    const metrics = portfolioManager.calculateMetrics();
                    
                    // Add fade-in animation to cards (staggered)
                    setTimeout(() => {
                        const cards = document.querySelectorAll('.summary-card');
                        cards.forEach((card, index) => {
                            card.style.opacity = '0';
                            setTimeout(() => {
                                card.classList.add('fade-in');
                                card.style.opacity = '1';
                            }, index * 50);
                        });
                    }, 10);
                    
                    // Update main metrics
                    document.getElementById('totalValue').textContent = this.formatCurrency(metrics.totalCurrentValue);
                    document.getElementById('totalInvested').textContent = this.formatCurrency(metrics.totalInvested);
                    document.getElementById('totalReturn').textContent = this.formatCurrency(metrics.totalGainLoss);
                    
                    const returnPctEl = document.getElementById('totalReturnPct');
                    returnPctEl.textContent = `${metrics.totalReturnPct >= 0 ? '+' : ''}${metrics.totalReturnPct.toFixed(2)}%`;
                    returnPctEl.style.color = metrics.totalReturnPct >= 0 ? 'var(--success-color)' : 'var(--danger-color)';
                    
                    document.getElementById('holdingsCount').textContent = metrics.holdingsCount;
                    
                    // Leverage
                    const leverageEl = document.getElementById('leverage');
                    const leverageLabelEl = document.getElementById('leverageLabel');
                    
                    if (metrics.totalDebt > 0) {
                        leverageEl.textContent = `${metrics.leveragePct.toFixed(1)}%`;
                        
                        if (metrics.leveragePct < 20) {
                            leverageLabelEl.textContent = '🟢 Low';
                            leverageLabelEl.style.color = 'var(--success-color)';
                        } else if (metrics.leveragePct < 50) {
                            leverageLabelEl.textContent = '🟡 Medium';
                            leverageLabelEl.style.color = 'var(--warning-color)';
                        } else {
                            leverageLabelEl.textContent = '🔴 High';
                            leverageLabelEl.style.color = 'var(--danger-color)';
                        }
                    } else {
                        leverageEl.textContent = '0%';
                        leverageLabelEl.textContent = 'No debt';
                        leverageLabelEl.style.color = 'var(--text-secondary)';
                    }
                    
                    // Calculate performance insights
                    this.renderPerformanceInsights(metrics);
                }
                
                renderPerformanceInsights(metrics) {
                    // Filter out loans and positions without price changes
                    const tradablePositions = metrics.positions.filter(p => 
                        p.assetClass !== 'loan' && p.priceChangePct !== undefined && p.priceChangePct !== 0
                    );
                    
                    if (tradablePositions.length === 0) {
                        // No data yet
                        document.getElementById('bestPerformerTicker').textContent = '—';
                        document.getElementById('bestPerformerChange').textContent = 'No data yet';
                        document.getElementById('worstPerformerTicker').textContent = '—';
                        document.getElementById('worstPerformerChange').textContent = 'No data yet';
                        document.getElementById('dayChangeValue').textContent = '$0.00';
                        document.getElementById('dayChangePct').textContent = '0.00%';
                        return;
                    }
                    
                    // Find best and worst performers
                    const sorted = [...tradablePositions].sort((a, b) => b.priceChangePct - a.priceChangePct);
                    const bestPerformer = sorted[0];
                    const worstPerformer = sorted[sorted.length - 1];
                    
                    // Best performer
                    const bestTickerEl = document.getElementById('bestPerformerTicker');
                    const bestChangeEl = document.getElementById('bestPerformerChange');
                    
                    bestTickerEl.textContent = bestPerformer.ticker;
                    bestChangeEl.textContent = `+${bestPerformer.priceChangePct.toFixed(2)}%`;
                    bestChangeEl.className = 'performer-change positive';
                    
                    // Worst performer
                    const worstTickerEl = document.getElementById('worstPerformerTicker');
                    const worstChangeEl = document.getElementById('worstPerformerChange');
                    
                    worstTickerEl.textContent = worstPerformer.ticker;
                    worstChangeEl.textContent = `${worstPerformer.priceChangePct.toFixed(2)}%`;
                    worstChangeEl.className = worstPerformer.priceChangePct >= 0 ? 'performer-change positive' : 'performer-change negative';
                    
                    // Calculate total day change
                    let totalDayChange = 0;
                    tradablePositions.forEach(position => {
                        if (position.priceChange && position.shares) {
                            totalDayChange += position.priceChange * position.shares;
                        }
                    });
                    
                    const dayChangeValueEl = document.getElementById('dayChangeValue');
                    const dayChangePctEl = document.getElementById('dayChangePct');
                    
                    dayChangeValueEl.textContent = this.formatCurrency(Math.abs(totalDayChange));
                    dayChangeValueEl.className = totalDayChange >= 0 ? 'day-change-value positive' : 'day-change-value negative';
                    
                    if (totalDayChange >= 0) {
                        dayChangeValueEl.textContent = '+' + dayChangeValueEl.textContent;
                    } else {
                        dayChangeValueEl.textContent = '-' + dayChangeValueEl.textContent;
                    }
                    
                    const dayChangePct = metrics.totalCurrentValue > 0 ? (totalDayChange / metrics.totalCurrentValue) * 100 : 0;
                    dayChangePctEl.textContent = `${dayChangePct >= 0 ? '↑' : '↓'} ${Math.abs(dayChangePct).toFixed(2)}%`;
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
                    <td>
                                            <div class="price-with-change">
                                                <span class="price-main">${this.formatCurrency(position.currentPrice)}</span>
                                                ${this.renderPriceChange(position)}
                                            </div>
                                        </td>
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
    formatAssetClass(assetClass) {
        return assetClass.charAt(0).toUpperCase() + assetClass.slice(1);
    }

    updateLastUpdated() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const lastUpdatedEl = document.getElementById('lastUpdated');
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = `Last updated: ${timeString}`;
        }
    }

    // NUEVO MÉTODO - Render price change indicator
        renderPriceChange(position) {
            // Don't show change for loans
            if (position.assetClass === 'loan') {
                return '';
            }

            // No last price = no change to show
            if (!position.lastPrice || position.priceChangePct === 0) {
                return '<span class="price-change neutral">—</span>';
            }

            const isUp = position.priceChangePct > 0;
            const arrow = isUp ? '↑' : '↓';
            const className = isUp ? 'up' : 'down';
            const sign = isUp ? '+' : '';

            return `
                <span class="price-change ${className} price-tooltip" 
                      data-tooltip="Since last update">
                    <span class="price-arrow">${arrow}</span>
                    <span>${sign}${position.priceChangePct.toFixed(2)}%</span>
                </span>
            `;
        }

    handleExportPortfolio() {
        try {
            // Get JSON data
            const jsonData = portfolioManager.exportToJSON();
            
            // Create blob
            const blob = new Blob([jsonData], { type: 'application/json' });
            
            // Create download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            
            // Set filename with current date
            const date = new Date().toISOString().split('T')[0];
            link.download = `portfolio-backup-${date}.json`;
            link.href = url;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up
            URL.revokeObjectURL(url);
            
            console.log('✅ Portfolio exported successfully');
            alert('Portfolio exported successfully! Check your Downloads folder.');
            
        } catch (error) {
            console.error('Export error:', error);
            alert('Error exporting portfolio: ' + error.message);
        }
    }

    handleImportPortfolio() {
        // Trigger the hidden file input
        const fileInput = document.getElementById('importFileInput');
        if (fileInput) {
            fileInput.click();
        }
    }

    handleFileSelected(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Check file type
        if (!file.name.endsWith('.json')) {
            alert('Please select a valid JSON file');
            return;
        }

        // Read file
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const jsonString = event.target.result;
                
                // Ask user: Replace or Merge?
                const mode = confirm(
                    'Replace current portfolio?\n\n' +
                    'OK = Replace everything\n' +
                    'Cancel = Merge (add new positions)'
                ) ? 'replace' : 'merge';
                
                // Import
                const result = portfolioManager.importFromJSON(jsonString, mode);
                
                if (result.success) {
                    this.render();
                    alert(`✅ Import successful!\n\nImported: ${result.imported} positions\nTotal: ${result.total} positions`);
                    console.log('✅ Portfolio imported:', result);
                } else {
                    alert('❌ Import failed:\n\n' + result.error);
                    console.error('Import error:', result.error);
                }
                
            } catch (error) {
                alert('❌ Error reading file:\n\n' + error.message);
                console.error('File read error:', error);
            }
            
            // Reset file input
            e.target.value = '';
        };
        
        reader.onerror = () => {
            alert('Error reading file');
        };
        
        reader.readAsText(file);
    }
// ============ AUTO-REFRESH FUNCTIONALITY ============
    
    handleToggleAutoRefresh() {
        this.autoRefreshEnabled = !this.autoRefreshEnabled;
        
        const btn = document.getElementById('toggleAutoRefresh');
        const nextRefreshEl = document.getElementById('nextRefresh');
        
        if (this.autoRefreshEnabled) {
            // Start auto-refresh
            btn.innerHTML = '▶️ Auto-Refresh';
            btn.classList.add('btn-auto-refresh-active');
            nextRefreshEl.style.display = 'block';
            
            this.startAutoRefresh();
            console.log('✅ Auto-refresh enabled (every 5 minutes)');
            
        } else {
            // Stop auto-refresh
            btn.innerHTML = '⏸️ Auto-Refresh';
            btn.classList.remove('btn-auto-refresh-active');
            nextRefreshEl.style.display = 'none';
            
            this.stopAutoRefresh();
            console.log('⏸️ Auto-refresh disabled');
        }
    }
    
    startAutoRefresh() {
        // Clear any existing intervals
        this.stopAutoRefresh();
        
        // Set next refresh time
        this.nextRefreshTime = Date.now() + (this.refreshIntervalMinutes * 60 * 1000);
        
        // Start countdown
        this.startCountdown();
        
        // Set interval for auto-refresh
        this.autoRefreshInterval = setInterval(() => {
            this.performAutoRefresh();
        }, this.refreshIntervalMinutes * 60 * 1000);
    }
    
    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
    }
    
    startCountdown() {
        // Update countdown every second
        this.countdownInterval = setInterval(() => {
            const now = Date.now();
            const timeLeft = this.nextRefreshTime - now;
            
            if (timeLeft <= 0) {
                // Time's up, will refresh on next interval cycle
                this.updateCountdownDisplay('00:00');
                return;
            }
            
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            
            this.updateCountdownDisplay(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);
    }
    
    updateCountdownDisplay(timeString) {
        const countdownEl = document.getElementById('countdown');
        if (countdownEl) {
            countdownEl.textContent = timeString;
        }
    }
    
    async performAutoRefresh() {
        console.log('🔄 Auto-refresh triggered');
        
        // Show notification
        this.showRefreshNotification();
        
        // Trigger fetch (reuse existing method)
        const btn = document.getElementById('fetchRealPrices');
        if (btn && !btn.disabled) {
            // Simulate click on fetch button
            btn.click();
        }
        
        // Reset timer for next refresh
        this.nextRefreshTime = Date.now() + (this.refreshIntervalMinutes * 60 * 1000);
    }
    
    showRefreshNotification() {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'refresh-notification';
        notification.innerHTML = '🔄 Auto-refreshing prices...';
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // ============ NAVIGATION ============
        
        handleNavigation(e) {
            const btn = e.currentTarget;
            const view = btn.dataset.view;
            
            // Ignore disabled buttons
            if (btn.disabled) {
                return;
            }
            
            // Update active state
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Switch views
            document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active'));
            const targetView = document.getElementById(`${view}View`);
            if (targetView) {
                targetView.classList.add('active');
            }
            
            console.log(`📍 Navigated to: ${view}`);
        }
        
        handleSettings() {
            alert('⚙️ Settings\n\nComing soon:\n• Theme preferences\n• API key management\n• Export settings\n• Notification preferences');
        }
            
}  // ← Esta llave cierra la clase App

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
