/* ===================================
   CHARTS MANAGER
   Handles Chart.js rendering
   =================================== */

class ChartsManager {
    constructor() {
            this.allocationChart = null;
            this.holdingsChart = null;
            
            // Color mapping by asset class
            this.assetColors = {
                'stocks': '#2563eb',      // Blue
                'crypto': '#10b981',      // Green
                'commodities': '#f59e0b', // Orange
                'etf': '#8b5cf6',         // Purple (changed from red)
                'bonds': '#ec4899',       // Pink
                'loan': '#ef4444',        // Red (reserved for debt)
                'other': '#06b6d4'        // Cyan
            };
            
            this.chartColors = Object.values(this.assetColors);
        }

    // Initialize charts
    init() {
        this.initAllocationChart();
        this.initHoldingsChart();
    }

    // Create allocation pie chart
    initAllocationChart() {
        const ctx = document.getElementById('allocationChart');
        if (!ctx) return;

        this.allocationChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: this.chartColors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: $${value.toLocaleString('en-US', {maximumFractionDigits: 0})} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Create holdings bar chart
    initHoldingsChart() {
        const ctx = document.getElementById('holdingsChart');
        if (!ctx) return;

        this.holdingsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Position Value',
                    data: [],
                    backgroundColor: '#2563eb',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Value: $${context.parsed.y.toLocaleString('en-US', {maximumFractionDigits: 0})}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString('en-US', {maximumFractionDigits: 0});
                            }
                        }
                    }
                }
            }
        });
    }

    // Update allocation chart
        updateAllocationChart(allocation) {
            if (!this.allocationChart) return;

            // Filter out loans (negative values) - we'll show them separately
            const positiveAllocation = {};
            Object.keys(allocation).forEach(assetClass => {
                if (allocation[assetClass] > 0) {
                    positiveAllocation[assetClass] = allocation[assetClass];
                }
            });

            const labels = Object.keys(positiveAllocation).map(key => 
                key.charAt(0).toUpperCase() + key.slice(1)
            );
            const data = Object.values(positiveAllocation);
            
            // Map colors to asset classes
            const colors = Object.keys(positiveAllocation).map(assetClass => 
                this.assetColors[assetClass] || '#06b6d4'
            );

            this.allocationChart.data.labels = labels;
            this.allocationChart.data.datasets[0].data = data;
            this.allocationChart.data.datasets[0].backgroundColor = colors;
            this.allocationChart.update();
        }

    // Update holdings chart
        updateHoldingsChart(topHoldings) {
            if (!this.holdingsChart) return;

            const labels = topHoldings.map(h => h.ticker);
            const data = topHoldings.map(h => h.currentValue);
            
            // Color bars by asset class
            const colors = topHoldings.map(h => 
                this.assetColors[h.assetClass] || '#06b6d4'
            );

            this.holdingsChart.data.labels = labels;
            this.holdingsChart.data.datasets[0].data = data;
            this.holdingsChart.data.datasets[0].backgroundColor = colors;
            this.holdingsChart.update();
        }

    // Refresh all charts
    refresh() {
        const allocation = portfolioManager.getAssetAllocation();
        const topHoldings = portfolioManager.getTopHoldings(5);

        this.updateAllocationChart(allocation);
        this.updateHoldingsChart(topHoldings);
    }
}

// Create global instance
const chartsManager = new ChartsManager();
