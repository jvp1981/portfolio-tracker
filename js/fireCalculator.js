/* ===================================
   FIRE CALCULATOR
   Financial Independence, Retire Early
   =================================== */

class FIRECalculator {
    constructor() {
        this.inputs = {};
        this.results = {};
        this.init();
    }
    
    init() {
        console.log('🔥 FIRE Calculator initializing...');
        this.setupEventListeners();
        this.loadPortfolioData();
        console.log('✅ FIRE Calculator ready!');
    }
    
    setupEventListeners() {
        // Calculate button
        const calculateBtn = document.getElementById('calculateFIRE');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.calculate());
        }
        
        // Simulate button
        const simulateBtn = document.getElementById('runSimulation');
        if (simulateBtn) {
            simulateBtn.addEventListener('click', () => this.runMonteCarloSimulation());
        }
        
        // Withdrawal rate slider
        const withdrawalSlider = document.getElementById('withdrawalRate');
        if (withdrawalSlider) {
            withdrawalSlider.addEventListener('input', (e) => {
                document.getElementById('withdrawalRateValue').textContent = e.target.value + '%';
            });
        }
        
        // Allocation inputs - auto-calculate total
        const allocInputs = document.querySelectorAll('.alloc-input');
        allocInputs.forEach(input => {
            input.addEventListener('input', () => this.updateAllocationTotal());
        });
        
        // Portfolio inputs - auto-calculate total
        const portfolioInputs = document.querySelectorAll('.portfolio-edit-input');
        portfolioInputs.forEach(input => {
            input.addEventListener('input', () => this.updatePortfolioTotal());
        });
        
        // Stocks allocation dropdown
        const stocksSelect = document.getElementById('stocksAllocation');
        if (stocksSelect) {
            stocksSelect.addEventListener('change', (e) => {
                const customInput = document.getElementById('customStocksReturn');
                if (e.target.value === 'custom') {
                    customInput.style.display = 'block';
                } else {
                    customInput.style.display = 'none';
                }
            });
        }
        
        // Inflation model radio
        const inflationRadios = document.querySelectorAll('input[name="inflationModel"]');
        inflationRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const customInput = document.getElementById('customInflation');
                if (e.target.value === 'custom') {
                    customInput.style.display = 'block';
                } else {
                    customInput.style.display = 'none';
                }
            });
        });

        // Timeline controls
        const timelineSelect = document.getElementById('timelineYears');
        if (timelineSelect) {
            timelineSelect.addEventListener('change', () => {
                if (this.results.fireNumbers) {
                    this.drawTimelineChart();
                }
            });
        }

        const logScaleCheckbox = document.getElementById('logScale');
        if (logScaleCheckbox) {
            logScaleCheckbox.addEventListener('change', () => {
                if (this.results.fireNumbers) {
                    this.drawTimelineChart();
                }
            });
        }
    }
    
    loadPortfolioData() {
        // Load from portfolio manager
        if (typeof portfolioManager === 'undefined') {
            console.warn('⚠️ PortfolioManager not available');
            return;
        }
        
        const metrics = portfolioManager.calculateMetrics();
        
        // Categorize assets
        let btc = 0, stocks = 0, bonds = 0, cash = 0, other = 0;
        
        metrics.positions.forEach(position => {
            const value = position.currentValue || 0;
            const assetClass = position.assetClass.toLowerCase();
            
            if (position.ticker.includes('BTC') || assetClass === 'crypto') {
                btc += value;
            } else if (assetClass === 'stocks' || assetClass === 'etf') {
                stocks += value;
            } else if (assetClass === 'bonds') {
                bonds += value;
            } else if (assetClass === 'loan') {
                // Loans count as negative (debt)
                other -= value;
            } else {
                other += value;
            }
        });
        
        // Update UI
        document.getElementById('currentBTC').value = Math.round(btc);
        document.getElementById('currentStocks').value = Math.round(stocks);
        document.getElementById('currentBonds').value = Math.round(bonds);
        document.getElementById('currentCash').value = Math.round(cash);
        document.getElementById('currentOther').value = Math.round(other);
        
        this.updatePortfolioTotal();
        
        console.log('📊 Portfolio data loaded:', {btc, stocks, bonds, cash, other});
    }
    
    updatePortfolioTotal() {
        const btc = parseFloat(document.getElementById('currentBTC').value) || 0;
        const stocks = parseFloat(document.getElementById('currentStocks').value) || 0;
        const bonds = parseFloat(document.getElementById('currentBonds').value) || 0;
        const cash = parseFloat(document.getElementById('currentCash').value) || 0;
        const other = parseFloat(document.getElementById('currentOther').value) || 0;
        
        const total = btc + stocks + bonds + cash + other;
        
        document.getElementById('currentTotal').textContent = this.formatCurrency(total);
    }
    
    updateAllocationTotal() {
        const btc = parseFloat(document.getElementById('allocBTC').value) || 0;
        const stocks = parseFloat(document.getElementById('allocStocks').value) || 0;
        const bonds = parseFloat(document.getElementById('allocBonds').value) || 0;
        const cash = parseFloat(document.getElementById('allocCash').value) || 0;
        
        const total = btc + stocks + bonds + cash;
        
        const totalEl = document.getElementById('allocationTotal');
        totalEl.textContent = `Total: ${total}%`;
        
        if (total === 100) {
            totalEl.className = 'allocation-total valid';
        } else {
            totalEl.className = 'allocation-total invalid';
        }
    }
    
    // ============ CORE CALCULATIONS ============
    
    calculate() {
        console.log('🔥 Starting FIRE calculation...');
        
        // Gather inputs
        this.gatherInputs();
        
        // Validate
        if (!this.validateInputs()) {
            return;
        }
        
        // Calculate FIRE numbers
        const fireNumbers = this.calculateFIRENumbers();
        
        // Project portfolio growth
        const timeline = this.projectPortfolioGrowth(50); // 50 years projection
        
        // Store results
        this.results = {
            fireNumbers,
            timeline
        };
        
        // Display results
        this.displayResults();
        
        console.log('✅ FIRE calculation complete:', this.results);
    }
    
    gatherInputs() {
        // Current Portfolio
        this.inputs.currentPortfolio = {
            btc: parseFloat(document.getElementById('currentBTC').value) || 0,
            stocks: parseFloat(document.getElementById('currentStocks').value) || 0,
            bonds: parseFloat(document.getElementById('currentBonds').value) || 0,
            cash: parseFloat(document.getElementById('currentCash').value) || 0,
            other: parseFloat(document.getElementById('currentOther').value) || 0
        };
        
        this.inputs.currentPortfolio.total = 
            this.inputs.currentPortfolio.btc +
            this.inputs.currentPortfolio.stocks +
            this.inputs.currentPortfolio.bonds +
            this.inputs.currentPortfolio.cash +
            this.inputs.currentPortfolio.other;
        
        // Personal Info
        this.inputs.currentAge = parseInt(document.getElementById('currentAge').value) || 35;
        this.inputs.targetAge = parseInt(document.getElementById('targetAge').value) || null;
        
        // Expenses & Contributions
        this.inputs.annualExpenses = parseFloat(document.getElementById('annualExpenses').value) || 40000;
        this.inputs.monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 2500;
        this.inputs.withdrawalRate = parseFloat(document.getElementById('withdrawalRate').value) / 100 || 0.04;
        this.inputs.withdrawalStartYear = parseInt(document.getElementById('withdrawalStartYear').value) || 2050;
        
        // Contribution Allocation
        this.inputs.allocation = {
            btc: parseFloat(document.getElementById('allocBTC').value) / 100 || 0,
            stocks: parseFloat(document.getElementById('allocStocks').value) / 100 || 0,
            bonds: parseFloat(document.getElementById('allocBonds').value) / 100 || 0,
            cash: parseFloat(document.getElementById('allocCash').value) / 100 || 0
        };
        
        // Growth Models
        this.inputs.btcGrowthModel = document.getElementById('btcGrowthModel').value || 'conservative-high';
        
        const stocksAlloc = document.getElementById('stocksAllocation').value;
        if (stocksAlloc === 'custom') {
            this.inputs.stocksReturn = parseFloat(document.getElementById('customStocksReturn').value) / 100 || 0.085;
        } else {
            // Map preset allocations to returns
            const returns = {
                '60/40': 0.07,
                '80/20': 0.085,
                '100stocks': 0.10
            };
            this.inputs.stocksReturn = returns[stocksAlloc] || 0.085;
        }
        
        this.inputs.bondsReturn = parseFloat(document.getElementById('bondsReturn').value) / 100 || 0.04;
        
        // Inflation & Tax
        const inflationModel = document.querySelector('input[name="inflationModel"]:checked').value;
        if (inflationModel === 'cpi') {
            this.inputs.inflation = 0.02;
        } else if (inflationModel === 'truflation') {
            this.inputs.inflation = 0.08;
        } else {
            this.inputs.inflation = parseFloat(document.getElementById('customInflation').value) / 100 || 0.02;
        }
        
        this.inputs.capitalGainsTax = parseFloat(document.getElementById('capitalGainsTax').value) / 100 || 0.23;
        
        // Withdrawal Strategy
        this.inputs.withdrawalStrategy = document.querySelector('input[name="withdrawalStrategy"]:checked').value || 'proportional';
        
        console.log('📥 Inputs gathered:', this.inputs);
    }
    
    validateInputs() {
        // If no monthly contribution, skip allocation check
        if (this.inputs.monthlyContribution > 0) {
            // Check allocation totals 100%
            const allocTotal = 
                this.inputs.allocation.btc +
                this.inputs.allocation.stocks +
                this.inputs.allocation.bonds +
                this.inputs.allocation.cash;
            
            if (Math.abs(allocTotal - 1.0) > 0.01) {
                alert('⚠️ Contribution allocation must total 100%\n\nCurrent: ' + (allocTotal * 100).toFixed(1) + '%');
                return false;
            }
        }
        
        // Check annual expenses > 0
        if (this.inputs.annualExpenses <= 0) {
            alert('⚠️ Annual expenses must be greater than 0');
            return false;
        }
        
        return true;
    }
    
    calculateFIRENumbers() {
        // Required portfolio = Annual expenses / Withdrawal rate (25x rule if 4%)
        const requiredPortfolio = this.inputs.annualExpenses / this.inputs.withdrawalRate;
        
        // Annual withdrawal (after tax)
        const grossWithdrawal = requiredPortfolio * this.inputs.withdrawalRate;
        const netWithdrawal = grossWithdrawal * (1 - this.inputs.capitalGainsTax);
        
        // Calculate years to FIRE with contributions
        const yearsToFIRE = this.calculateYearsToFIRE(requiredPortfolio);
        
        // FIRE age
        const fireAge = this.inputs.currentAge + yearsToFIRE;
        const fireYear = new Date().getFullYear() + yearsToFIRE;
        
        return {
            requiredPortfolio,
            yearsToFIRE,
            fireAge,
            fireYear,
            grossWithdrawal,
            netWithdrawal,
            monthlyWithdrawal: netWithdrawal / 12
        };
    }
    
    calculateYearsToFIRE(targetAmount) {
            let years = 0;
            const maxYears = 100;
            
            // Start with current portfolio breakdown
            let btcValue = this.inputs.currentPortfolio.btc;
            let stocksValue = this.inputs.currentPortfolio.stocks;
            let bondsValue = this.inputs.currentPortfolio.bonds;
            let cashValue = this.inputs.currentPortfolio.cash;
            let otherValue = this.inputs.currentPortfolio.other;
            
            let totalPortfolio = btcValue + stocksValue + bondsValue + cashValue + otherValue;
            
            while (totalPortfolio < targetAmount && years < maxYears) {
                years++;
                
                // Apply growth to each asset class
                const btcReturn = this.getBitcoinReturn(years);
                const stocksReturn = this.inputs.stocksReturn;
                const bondsReturn = this.inputs.bondsReturn;
                
                // Grow each asset
                btcValue *= (1 + btcReturn);
                stocksValue *= (1 + stocksReturn);
                bondsValue *= (1 + bondsReturn);
                // Cash and other don't grow
                
                // Add monthly contributions
                const annualContribution = this.inputs.monthlyContribution * 12;
                btcValue += annualContribution * this.inputs.allocation.btc;
                stocksValue += annualContribution * this.inputs.allocation.stocks;
                bondsValue += annualContribution * this.inputs.allocation.bonds;
                cashValue += annualContribution * this.inputs.allocation.cash;
                
                // Recalculate total
                totalPortfolio = btcValue + stocksValue + bondsValue + cashValue + otherValue;
            }
            
            return years >= maxYears ? maxYears : years;
        }
    
    getBitcoinReturn(year) {
        const model = this.inputs.btcGrowthModel;
        
        if (model === 'conservative-high') {
            // Early years: 30% CAGR
            return 0.30;
        } else if (model === 'conservative-mid') {
            // Middle years: 15% CAGR
            return 0.15;
        } else if (model === 'conservative-low') {
            // Mature: 8% CAGR
            return 0.08;
        } else if (model === 'powerlaw') {
            // Power Law: decaying over time
            // Year 1-5: 40%, Year 6-10: 25%, Year 11-20: 15%, Year 20+: 8%
            if (year <= 5) return 0.40;
            if (year <= 10) return 0.25;
            if (year <= 20) return 0.15;
            return 0.08;
        }
        
        return 0.15; // Default
    }
    
    projectPortfolioGrowth(years) {
        const timeline = [];
        let portfolio = this.inputs.currentPortfolio.total;
        
        let btcValue = this.inputs.currentPortfolio.btc;
        let stocksValue = this.inputs.currentPortfolio.stocks;
        let bondsValue = this.inputs.currentPortfolio.bonds;
        let cashValue = this.inputs.currentPortfolio.cash;
        
        timeline.push({
            year: 0,
            age: this.inputs.currentAge,
            total: portfolio,
            btc: btcValue,
            stocks: stocksValue,
            bonds: bondsValue,
            cash: cashValue
        });
        
        for (let year = 1; year <= years; year++) {
            // Growth
            btcValue *= (1 + this.getBitcoinReturn(year));
            stocksValue *= (1 + this.inputs.stocksReturn);
            bondsValue *= (1 + this.inputs.bondsReturn);
            // Cash doesn't grow
            
            // Contributions
            const annualContribution = this.inputs.monthlyContribution * 12;
            btcValue += annualContribution * this.inputs.allocation.btc;
            stocksValue += annualContribution * this.inputs.allocation.stocks;
            bondsValue += annualContribution * this.inputs.allocation.bonds;
            cashValue += annualContribution * this.inputs.allocation.cash;
            
            portfolio = btcValue + stocksValue + bondsValue + cashValue;
            
            timeline.push({
                year,
                age: this.inputs.currentAge + year,
                total: portfolio,
                btc: btcValue,
                stocks: stocksValue,
                bonds: bondsValue,
                cash: cashValue
            });
        }
        
        return timeline;
    }
    
// ============ MONTE CARLO SIMULATION ============
    
    runMonteCarloSimulation() {
        console.log('🎲 Running Monte Carlo simulation...');
        
        if (!this.inputs.annualExpenses) {
            alert('⚠️ Please run basic calculation first');
            return;
        }
        
        const iterations = 10000;
        const targetAmount = this.results.fireNumbers.requiredPortfolio;
        const results = [];
        
        // Show loading
        const simulateBtn = document.getElementById('runSimulation');
        const originalText = simulateBtn.textContent;
        simulateBtn.textContent = '⏳ Simulating...';
        simulateBtn.disabled = true;
        
        // Run simulation async to not block UI
        setTimeout(() => {
            for (let i = 0; i < iterations; i++) {
                const yearsToFIRE = this.runSingleSimulation(targetAmount);
                results.push(yearsToFIRE);
            }
            
            // Calculate statistics
            results.sort((a, b) => a - b);
            
            const p10 = results[Math.floor(iterations * 0.10)]; // Pessimistic (10th percentile)
            const p50 = results[Math.floor(iterations * 0.50)]; // Median
            const p90 = results[Math.floor(iterations * 0.90)]; // Optimistic (90th percentile)
            
            const successCount = results.filter(y => y < 100).length;
            const successRate = (successCount / iterations) * 100;
            
            this.results.monteCarlo = {
                p10,
                p50,
                p90,
                successRate,
                iterations
            };
            
            // Update display
            document.getElementById('successRate').textContent = successRate.toFixed(1) + '%';
            
            // Update metric cards with scenarios
            this.updateMetricsWithScenarios(p10, p50, p90);
            
            // Restore button
            simulateBtn.textContent = originalText;
            simulateBtn.disabled = false;
            
            console.log('✅ Monte Carlo complete:', this.results.monteCarlo);
            
            alert(`✅ Simulation Complete!\n\n${iterations} scenarios analyzed:\n\n` +
                  `• Pessimistic (P10): ${p10} years\n` +
                  `• Base Case (P50): ${p50} years\n` +
                  `• Optimistic (P90): ${p90} years\n\n` +
                  `Success Rate: ${successRate.toFixed(1)}%`);
            
        }, 100);
    }
    
    runSingleSimulation(targetAmount) {
        let portfolio = this.inputs.currentPortfolio.total;
        let years = 0;
        const maxYears = 100;
        
        // Historical volatility (annualized standard deviation)
        const btcVolatility = 0.80; // 80% for BTC
        const stocksVolatility = 0.18; // 18% for stocks
        const bondsVolatility = 0.05; // 5% for bonds
        
        let btcPct = this.inputs.currentPortfolio.btc / portfolio || 0;
        let stocksPct = this.inputs.currentPortfolio.stocks / portfolio || 0;
        let bondsPct = this.inputs.currentPortfolio.bonds / portfolio || 0;
        let cashPct = this.inputs.currentPortfolio.cash / portfolio || 0;
        
        while (portfolio < targetAmount && years < maxYears) {
            years++;
            
            // Random returns (normal distribution)
            const btcReturn = this.randomReturn(this.getBitcoinReturn(years), btcVolatility);
            const stocksReturn = this.randomReturn(this.inputs.stocksReturn, stocksVolatility);
            const bondsReturn = this.randomReturn(this.inputs.bondsReturn, bondsVolatility);
            
            // Grow portfolio
            portfolio = portfolio * (
                (btcPct * (1 + btcReturn)) +
                (stocksPct * (1 + stocksReturn)) +
                (bondsPct * (1 + bondsReturn)) +
                (cashPct * 1)
            );
            
            // Add contributions
            portfolio += this.inputs.monthlyContribution * 12;
        }
        
        return years >= maxYears ? maxYears : years;
    }
    
    randomReturn(mean, stdDev) {
        // Box-Muller transform for normal distribution
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        return mean + (z * stdDev);
    }
    
    updateMetricsWithScenarios(p10, p50, p90) {
        const currentYear = new Date().getFullYear();
        
        document.getElementById('yearsToFIRE').innerHTML = `
            <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
                Bear: ${p10}y | Base: ${p50}y | Bull: ${p90}y
            </div>
            <div>${p50}</div>
        `;
        
        document.getElementById('fireYear').textContent = 
            `Bear: ${currentYear + p10} | Base: ${currentYear + p50} | Bull: ${currentYear + p90}`;
    }
    
    // ============ CRASH SCENARIOS ============
    
    analyzeCrashScenarios() {
        const baseYears = this.results.fireNumbers.yearsToFIRE;
        
        // Scenario 1: -30% crash in year 5
        const bearImpact = this.simulateCrash(-0.30, 5);
        document.getElementById('bearImpact').textContent = `+${bearImpact} years`;
        
        // Scenario 2: -50% crash in year 10
        const crashImpact = this.simulateCrash(-0.50, 10);
        document.getElementById('crashImpact').textContent = `+${crashImpact} years`;
        
        // Scenario 3: BTC -80% crash in year 7
        const btcCrashImpact = this.simulateBTCCrash(-0.80, 7);
        document.getElementById('btcCrashImpact').textContent = `+${btcCrashImpact} years`;
    }
    
    simulateCrash(crashPct, crashYear) {
        // Simplified: assume portfolio hit by crash, recalculate years
        const originalPortfolio = this.inputs.currentPortfolio.total;
        
        // Temporarily reduce portfolio
        this.inputs.currentPortfolio.total *= (1 + crashPct);
        this.inputs.currentPortfolio.btc *= (1 + crashPct);
        this.inputs.currentPortfolio.stocks *= (1 + crashPct);
        this.inputs.currentPortfolio.bonds *= (1 + crashPct);
        
        const newYears = this.calculateYearsToFIRE(this.results.fireNumbers.requiredPortfolio);
        
        // Restore
        this.inputs.currentPortfolio.total = originalPortfolio;
        
        return Math.max(0, newYears - this.results.fireNumbers.yearsToFIRE);
    }
    
    simulateBTCCrash(crashPct, crashYear) {
        const originalBTC = this.inputs.currentPortfolio.btc;
        
        this.inputs.currentPortfolio.btc *= (1 + crashPct);
        this.inputs.currentPortfolio.total = 
            this.inputs.currentPortfolio.btc +
            this.inputs.currentPortfolio.stocks +
            this.inputs.currentPortfolio.bonds +
            this.inputs.currentPortfolio.cash;
        
        const newYears = this.calculateYearsToFIRE(this.results.fireNumbers.requiredPortfolio);
        
        // Restore
        this.inputs.currentPortfolio.btc = originalBTC;
        this.inputs.currentPortfolio.total = 
            this.inputs.currentPortfolio.btc +
            this.inputs.currentPortfolio.stocks +
            this.inputs.currentPortfolio.bonds +
            this.inputs.currentPortfolio.cash;
        
        return Math.max(0, newYears - this.results.fireNumbers.yearsToFIRE);
    }
    
    // ============ DISPLAY RESULTS ============
    
    displayResults() {
        // Show results section
        const resultsSection = document.getElementById('fireResults');
        resultsSection.classList.remove('hidden');
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Update metrics
        const fire = this.results.fireNumbers;
        
        document.getElementById('yearsToFIRE').textContent = fire.yearsToFIRE;
        document.getElementById('fireYear').textContent = 
            `Age ${fire.fireAge} (Year ${fire.fireYear})`;
        
        document.getElementById('requiredPortfolio').textContent = 
            this.formatCurrency(fire.requiredPortfolio);
        
        document.getElementById('annualWithdrawal').textContent = 
            this.formatCurrency(fire.netWithdrawal);
        document.getElementById('monthlyWithdrawal').textContent = 
            this.formatCurrency(fire.monthlyWithdrawal) + '/month (after tax)';
        
        document.getElementById('successRate').textContent = '--';
        
        // Draw charts
        this.drawTimelineChart();
        this.drawAllocationChart();
        
        // Analyze crash scenarios
        this.analyzeCrashScenarios();
    }
    
    drawTimelineChart() {
        const ctx = document.getElementById('fireTimelineChart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (window.fireTimelineChartInstance) {
            window.fireTimelineChartInstance.destroy();
        }
        
        // Get selected time horizon
        const yearsSelect = document.getElementById('timelineYears');
        const maxYears = yearsSelect ? parseInt(yearsSelect.value) : 50;
        
        // Get log scale preference
        const logScaleCheckbox = document.getElementById('logScale');
        const useLogScale = logScaleCheckbox ? logScaleCheckbox.checked : true;
        
        // Filter timeline to selected years
        const timeline = this.results.timeline.slice(0, maxYears + 1);
        
        window.fireTimelineChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeline.map(t => t.year === 0 ? 'Now' : `Year ${t.year}`),
                datasets: [{
                    label: 'Total Portfolio',
                    data: timeline.map(t => t.total),
                    borderColor: 'rgb(37, 99, 235)',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'FIRE Target',
                    data: Array(timeline.length).fill(this.results.fireNumbers.requiredPortfolio),
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return context.dataset.label + ': ' + this.formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: useLogScale ? 'logarithmic' : 'linear',
                        beginAtZero: !useLogScale,
                        min: useLogScale ? 1000 : undefined,
                        ticks: {
                            callback: (value) => this.formatCurrency(value, true)
                        }
                    }
                }
            }
        });
    }
    
    drawAllocationChart() {
        const ctx = document.getElementById('allocationEvolutionChart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (window.allocationChartInstance) {
            window.allocationChartInstance.destroy();
        }
        
        const timeline = this.results.timeline;
        
        window.allocationChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeline.map(t => `Year ${t.year}`),
                datasets: [
                    {
                        label: 'Bitcoin',
                        data: timeline.map(t => t.btc),
                        borderColor: 'rgb(249, 115, 22)',
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        borderWidth: 2,
                        fill: true
                    },
                    {
                        label: 'Stocks',
                        data: timeline.map(t => t.stocks),
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        fill: true
                    },
                    {
                        label: 'Bonds',
                        data: timeline.map(t => t.bonds),
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderWidth: 2,
                        fill: true
                    },
                    {
                        label: 'Cash',
                        data: timeline.map(t => t.cash),
                        borderColor: 'rgb(148, 163, 184)',
                        backgroundColor: 'rgba(148, 163, 184, 0.1)',
                        borderWidth: 2,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return context.dataset.label + ': ' + this.formatCurrency(context.parsed.y);
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        stacked: false,
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => this.formatCurrency(value, true)
                        }
                    }
                }
            }
        });
    }
    
    // ============ UTILITY METHODS ============
    
    formatCurrency(value, compact = false) {
        if (compact && value >= 1000000) {
            return '$' + (value / 1000000).toFixed(1) + 'M';
        } else if (compact && value >= 1000) {
            return '$' + (value / 1000).toFixed(0) + 'K';
        }
        
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }
}

// Initialize FIRE Calculator when DOM is ready
let fireCalculator;
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        fireCalculator = new FIRECalculator();
        window.fireCalculator = fireCalculator;
    }, 200);
});