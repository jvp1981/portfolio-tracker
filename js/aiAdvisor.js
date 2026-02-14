/* ===================================
   AI ADVISOR
   Investment Style-Based Portfolio Analysis
   =================================== */

class AIAdvisor {
    constructor() {
        this.selectedStyle = 'value'; // Default
        this.conversationHistory = [];
        this.isProcessing = false;
        
        // Load saved preference
        const savedStyle = localStorage.getItem('preferredAdvisoryStyle');
        if (savedStyle) {
            this.selectedStyle = savedStyle;
        }
        
        this.init();
    }
    
    init() {
        console.log('🤖 AI Advisor initializing...');
        this.setupEventListeners();
        this.updateSelectedStyle();
        console.log('✅ AI Advisor ready!');
    }
    
    setupEventListeners() {
        // Style card selection
        document.querySelectorAll('.style-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleStyleSelection(e));
        });
        
        // Quick action buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e));
        });
        
        // Send chat button
        const sendBtn = document.getElementById('sendChatBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.handleSendMessage());
        }
        
        // Enter key in chat input
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleSendMessage();
                }
            });
        }
    }
    
    handleStyleSelection(e) {
        const card = e.currentTarget;
        const style = card.dataset.style;
        
        // Update selected style
        this.selectedStyle = style;
        
        // Save preference
        localStorage.setItem('preferredAdvisoryStyle', style);
        
        // Update UI
        this.updateSelectedStyle();
        
        // Update welcome message
        this.updateWelcomeMessage();
        
        console.log(`🎯 Style changed to: ${style}`);
    }
    
    updateSelectedStyle() {
        // Remove active class from all cards
        document.querySelectorAll('.style-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Add active class to selected card
        const selectedCard = document.querySelector(`[data-style="${this.selectedStyle}"]`);
        if (selectedCard) {
            selectedCard.classList.add('active');
        }
        
        // Update indicator
        const styleInfo = this.getStyleInfo(this.selectedStyle);
        const indicator = document.getElementById('selectedStyleName');
        if (indicator) {
            indicator.textContent = `${styleInfo.icon} ${styleInfo.name}`;
        }
        
        // Update chat avatar
        this.updateChatAvatar();
    }
    
    updateChatAvatar() {
        const styleInfo = this.getStyleInfo(this.selectedStyle);
        const avatars = document.querySelectorAll('.ai-message .message-avatar');
        avatars.forEach(avatar => {
            avatar.textContent = styleInfo.icon;
        });
    }
    
    updateWelcomeMessage() {
        const styleInfo = this.getStyleInfo(this.selectedStyle);
        const chatMessages = document.getElementById('chatMessages');
        
        // Clear existing messages
        chatMessages.innerHTML = '';
        
        // Add new welcome message
        this.addAIMessage(
            `Hello! I'm your ${styleInfo.name} advisor, inspired by ${styleInfo.investors}. ` +
            `I'll analyze your portfolio through this lens.\n\n` +
            `Choose a quick action above, or ask me anything about your portfolio.`
        );
    }
    
    handleQuickAction(e) {
        const action = e.currentTarget.dataset.action;
        
        const prompts = {
            analyze: "Please analyze my portfolio comprehensively.",
            risk: "Assess the risk level of my portfolio.",
            rebalance: "Suggest rebalancing ideas for my portfolio."
        };
        
        const message = prompts[action];
        if (message) {
            this.sendMessage(message);
        }
    }
    
    handleSendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        if (this.isProcessing) {
            alert('⏳ Please wait for the current response to complete.');
            return;
        }
        
        // Clear input
        input.value = '';
        
        // Send message
        this.sendMessage(message);
    }
    
    async sendMessage(userMessage) {
            console.log('📤 Sending message:', userMessage);
            
            // Add user message to chat
            this.addUserMessage(userMessage);
            
            // Add loading indicator
            const loadingId = this.addLoadingMessage();
            console.log('⏳ Loading indicator added:', loadingId);
            
            // Get portfolio data
            const portfolioData = this.getPortfolioData();
            console.log('📊 Portfolio data:', portfolioData);
            
            // Get style-specific system prompt
            const systemPrompt = this.getSystemPrompt();
            console.log('🎯 System prompt length:', systemPrompt.length);
            
            // Construct full prompt
            const fullPrompt = this.constructPrompt(userMessage, portfolioData);
            console.log('📝 Full prompt constructed');
            
            try {
                this.isProcessing = true;
                
                console.log('🤖 Calling Claude API...');
                // Call Claude API
                const response = await this.callClaudeAPI(systemPrompt, fullPrompt);
                console.log('✅ Response received:', response.substring(0, 50) + '...');
                
                // Remove loading
                this.removeLoadingMessage(loadingId);
                console.log('🗑️ Loading removed');
                
                // Add AI response
                this.addAIMessage(response);
                console.log('💬 AI message added');
                
                // Store in history
                this.conversationHistory.push({
                    user: userMessage,
                    assistant: response,
                    timestamp: new Date().toISOString()
                });
                
            } catch (error) {
                console.error('❌ Error in sendMessage:', error);
                
                // Remove loading
                this.removeLoadingMessage(loadingId);
                
                // Show error message
                this.addAIMessage(
                    `❌ Sorry, I encountered an error: ${error.message}\n\nPlease check your API configuration and try again.`
                );
            } finally {
                this.isProcessing = false;
                console.log('✅ Processing complete');
            }
        }
    
        getPortfolioData() {
                // Check if portfolioManager exists
                if (typeof portfolioManager === 'undefined') {
                    console.error('❌ PortfolioManager not available');
                    return this.getEmptyPortfolioData();
                }
                
                const metrics = portfolioManager.calculateMetrics();
                
                // Safety check for metrics
                if (!metrics || !metrics.positions) {
                    console.error('❌ Invalid metrics data');
                    return this.getEmptyPortfolioData();
                }
                
                // Format holdings data
                const holdings = metrics.positions.map(p => {
                    const currentPrice = p.currentPrice || 0;
                    const returnPct = p.returnPct || 0;
                    const allocationPct = p.allocationPct || 0;
                    
                    return `- ${p.ticker} (${p.assetClass}): ${this.formatCurrency(currentPrice)} | ${returnPct >= 0 ? '+' : ''}${returnPct.toFixed(2)}% | Allocation: ${allocationPct.toFixed(1)}%`;
                }).join('\n');
                
                // Asset allocation
                const allocation = {};
                metrics.positions.forEach(p => {
                    const assetClass = p.assetClass || 'other';
                    const allocationPct = p.allocationPct || 0;
                    
                    if (!allocation[assetClass]) {
                        allocation[assetClass] = 0;
                    }
                    allocation[assetClass] += allocationPct;
                });
                
                const allocationText = Object.entries(allocation)
                    .map(([asset, pct]) => `- ${asset}: ${pct.toFixed(1)}%`)
                    .join('\n');
                
                return {
                    totalValue: this.formatCurrency(metrics.totalCurrentValue || 0),
                    totalInvested: this.formatCurrency(metrics.totalInvested || 0),
                    totalReturn: this.formatCurrency(metrics.totalGainLoss || 0),
                    totalReturnPct: (metrics.totalReturnPct || 0).toFixed(2),
                    holdingsCount: metrics.holdingsCount || 0,
                    leverage: (metrics.leveragePct || 0).toFixed(1),
                    holdings: holdings || 'No holdings',
                    allocation: allocationText || 'No allocation data'
                };
            }
            
            getEmptyPortfolioData() {
                return {
                    totalValue: '$0.00',
                    totalInvested: '$0.00',
                    totalReturn: '$0.00',
                    totalReturnPct: '0.00',
                    holdingsCount: 0,
                    leverage: '0.0',
                    holdings: 'No holdings available',
                    allocation: 'No allocation data'
                };
            }
    
    constructPrompt(userMessage, portfolioData) {
        return `Here is my current portfolio:

SUMMARY:
- Total Value: ${portfolioData.totalValue}
- Total Invested: ${portfolioData.totalInvested}
- Total Return: ${portfolioData.totalReturn} (${portfolioData.totalReturnPct >= 0 ? '+' : ''}${portfolioData.totalReturnPct}%)
- Number of Holdings: ${portfolioData.holdingsCount}
- Leverage: ${portfolioData.leverage}%

HOLDINGS:
${portfolioData.holdings}

ASSET ALLOCATION:
${portfolioData.allocation}

USER QUESTION: ${userMessage}

Please analyze and provide insights based on your investment philosophy.`;
    }
    
    getSystemPrompt() {
        const prompts = this.getAdvisoryStyles();
        return prompts[this.selectedStyle]?.systemPrompt || prompts.value.systemPrompt;
    }
    
    async callClaudeAPI(systemPrompt, userPrompt) {
            // Check if we should use real API
            const useRealAPI = settingsManager && settingsManager.hasApiKey();
            
            if (!useRealAPI) {
                // Use mock responses
                console.log('📝 Using mock response (no API key configured)');
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const mockResponses = this.getMockResponses();
                        const response = mockResponses[this.selectedStyle] || mockResponses.value;
                        resolve(response);
                    }, 1500);
                });
            }
            
            // Use real API via Vercel backend
            console.log('🤖 Calling Claude API via Vercel backend...');
            
            try {
                // Determine API endpoint
                const isProduction = window.location.hostname.includes('vercel.app');
                const apiEndpoint = isProduction 
                    ? '/api/chat'  // Vercel production
                    : 'http://localhost:3000/api/chat';  // Local testing
                
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        systemPrompt: systemPrompt,
                        userPrompt: userPrompt
                    })
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'API request failed');
                }
                
                const data = await response.json();
                console.log('✅ Claude API response received');
                
                return data.response;
                
            } catch (error) {
                console.error('❌ Error calling Claude API:', error);
                
                // Fallback to mock on error
                console.log('📝 Falling back to mock response');
                const mockResponses = this.getMockResponses();
                return mockResponses[this.selectedStyle] || mockResponses.value;
            }
        }
        
        /* UNCOMMENT WHEN YOU HAVE API KEY:
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'YOUR_API_KEY_HERE',
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1024,
                system: systemPrompt,
                messages: [
                    { role: 'user', content: userPrompt }
                ]
            })
        });
        
        const data = await response.json();
        return data.content[0].text;
        
        */
    }
    
    // UI Helper Methods
    
    addUserMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message user-message';
        messageEl.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        chatMessages.appendChild(messageEl);
        this.scrollToBottom();
    }
    
    addAIMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const styleInfo = this.getStyleInfo(this.selectedStyle);
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message ai-message';
        
        // Convert line breaks to paragraphs
        const paragraphs = message.split('\n\n').map(p => `<p>${this.escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('');
        
        messageEl.innerHTML = `
            <div class="message-avatar">${styleInfo.icon}</div>
            <div class="message-content">
                ${paragraphs}
            </div>
        `;
        chatMessages.appendChild(messageEl);
        this.scrollToBottom();
    }
    
    addLoadingMessage() {
        const chatMessages = document.getElementById('chatMessages');
        const styleInfo = this.getStyleInfo(this.selectedStyle);
        const loadingId = 'loading-' + Date.now();
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message ai-message';
        messageEl.id = loadingId;
        messageEl.innerHTML = `
            <div class="message-avatar">${styleInfo.icon}</div>
            <div class="message-content">
                <div class="message-loading">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(messageEl);
        this.scrollToBottom();
        return loadingId;
    }
    
    removeLoadingMessage(loadingId) {
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) {
            loadingEl.remove();
        }
    }
    
    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    }
    
    // Data Methods
        
        getStyleInfo(style) {
            const styles = {
                value: {
                    name: 'Value / Quality',
                    icon: '💎',
                    investors: 'Buffett, Munger, Ackman'
                },
                contrarian: {
                    name: 'Contrarian / Opportunistic',
                    icon: '🎯',
                    investors: 'Tepper, Druckenmiller'
                },
                macro: {
                    name: 'Macro / Global',
                    icon: '🌍',
                    investors: 'Dalio, Paul Tudor Jones'
                },
                quant: {
                    name: 'Quant / Systematic',
                    icon: '🔢',
                    investors: 'Jim Simons'
                },
                tech: {
                    name: 'Tech / Disruptive',
                    icon: '🚀',
                    investors: 'Thiel, Chamath'
                },
                growth: {
                    name: 'Growth (GARP)',
                    icon: '📈',
                    investors: 'Peter Lynch'
                }
            };
            
            return styles[style] || styles.value;
        }
        
        getAdvisoryStyles() {
            return {
                value: {
                    systemPrompt: `You are a value investing advisor in the tradition of Warren Buffett and Charlie Munger.

    Core Principles:
    - Focus on intrinsic value and margin of safety
    - Emphasize quality businesses with durable competitive advantages (moats)
    - Long-term holding periods (decades, not years)
    - Circle of competence - only invest in what you understand
    - Mr. Market is there to serve you, not instruct you
    - Price is what you pay, value is what you get

    Analysis Approach:
    - Assess competitive moats and business quality first
    - Look for pricing power and high returns on capital
    - Evaluate management integrity and capital allocation
    - Calculate intrinsic value vs market price
    - Identify margin of safety (30%+ discount preferred)
    - Consider opportunity cost against other investments

    Communication Style:
    - Patient, rational, unemotional
    - Use folksy wisdom and analogies
    - Focus on long-term business fundamentals
    - Question speculative holdings
    - Emphasize simplicity and clarity
    - Reference "wonderful businesses at fair prices"

    Be constructive but honest. Channel Buffett's clarity and Munger's candor.`
                },
                
                contrarian: {
                    systemPrompt: `You are a contrarian opportunistic investor like David Tepper and Stanley Druckenmiller.

    Core Principles:
    - Hunt for asymmetric risk/reward in dislocated markets
    - Buy fear, sell greed - extreme sentiment = opportunity
    - Concentrated bets when conviction is high
    - Flexible across asset classes and geographies
    - Willing to go against consensus when facts support it
    - Distressed situations and mean reversion opportunities

    Analysis Approach:
    - Identify market panic or euphoria in specific sectors
    - Assess risk/reward asymmetry (3:1 minimum)
    - Look for temporary vs permanent impairments
    - Evaluate recovery catalysts and timing
    - Consider positioning - are you early or late?
    - Stress test downside scenarios

    Communication Style:
    - Bold, decisive, contrarian
    - Challenge conventional wisdom
    - Focus on what others are missing
    - Emphasize conviction and position sizing
    - Reference market cycles and sentiment extremes
    - Pragmatic about cutting losses quickly

    Be provocative but analytical. Channel Tepper's boldness and Druckenmiller's flexibility.`
                },
                
                macro: {
                    systemPrompt: `You are a global macro strategist like Ray Dalio and Paul Tudor Jones.

    Core Principles:
    - Think in terms of global economic cycles and regimes
    - Portfolio construction through risk parity and correlation
    - Diversification across uncorrelated return streams
    - All-weather approach - prepare for multiple scenarios
    - Macro trends (rates, currencies, commodities, geopolitics)
    - Systematic frameworks with room for discretion

    Analysis Approach:
    - Assess portfolio through macro regime lens
    - Identify correlation risks and tail risk exposure
    - Evaluate inflation/deflation positioning
    - Consider geopolitical and policy impacts
    - Balance growth and defensive assets
    - Think in terms of risk-adjusted returns

    Communication Style:
    - Systematic, framework-driven
    - Reference economic principles and cycles
    - Balance optimism with risk management
    - Use scenario analysis
    - Emphasize balance and diversification
    - Think probabilistically

    Be thoughtful and systematic. Channel Dalio's principles-based thinking and PTJ's macro awareness.`
                },
                
                quant: {
                    systemPrompt: `You are a quantitative systematic investor like Jim Simons and Renaissance Technologies.

    Core Principles:
    - Data-driven, statistical approach over narratives
    - Exploit market inefficiencies systematically
    - Remove human emotion and bias from decisions
    - Backtesting and statistical significance
    - Diversification through uncorrelated strategies
    - Risk management through position sizing and stops

    Analysis Approach:
    - Analyze portfolio through quantitative metrics
    - Look for statistical patterns and anomalies
    - Assess factor exposures (value, momentum, quality, volatility)
    - Evaluate diversification mathematically
    - Consider correlation matrix and risk concentration
    - Use Sharpe ratio, drawdown analysis, etc.

    Communication Style:
    - Analytical, precise, data-focused
    - Reference statistical concepts
    - Minimize narrative, emphasize numbers
    - Question subjective judgments
    - Focus on measurable metrics
    - Systematic over discretionary

    Be rigorous and analytical. Channel Simons' quantitative mindset.`
                },
                
                tech: {
                    systemPrompt: `You are a tech-focused disruptive investor like Peter Thiel and Chamath Palihapitiya.

    Core Principles:
    - Zero to one - create new markets, don't compete in existing ones
    - Exponential thinking and power laws (not normal distributions)
    - Technology as deflationary and transformative force
    - Network effects and winner-take-all dynamics
    - Early-stage asymmetry - venture-style risk/reward
    - Contrarian truths - what do you believe that few agree with?

    Analysis Approach:
    - Assess technology moats and network effects
    - Evaluate market size and TAM expansion potential
    - Consider unit economics and path to profitability
    - Identify disruptive vs sustaining innovation
    - Question incumbents' vulnerability
    - Think 10x, not 10% improvements

    Communication Style:
    - Visionary, contrarian, provocative
    - Challenge legacy thinking
    - Reference tech trends and paradigm shifts
    - Emphasize exponential vs linear growth
    - Focus on transformative potential
    - Question conventional valuation frameworks

    Be bold and future-focused. Channel Thiel's contrarian vision and Chamath's tech conviction.`
                },
                
                growth: {
                    systemPrompt: `You are a growth investor like Peter Lynch - GARP (Growth At Reasonable Price).

    Core Principles:
    - Find companies growing faster than market at reasonable valuations
    - PEG ratio < 1 is attractive (PE / growth rate)
    - Understand the business story and competitive position
    - Look for "ten-baggers" with patience
    - Invest in what you know and can research
    - Follow earnings growth and quality
    - Balance growth potential with valuation discipline

    Analysis Approach:
    - Evaluate earnings growth rates vs PE multiples
    - Assess business narratives and competitive advantages
    - Calculate PEG ratios for holdings
    - Identify growth catalysts and runway
    - Consider market opportunity size
    - Balance growth quality with price paid

    Communication Style:
    - Accessible, practical, story-driven
    - Use real-world examples and analogies
    - Focus on business fundamentals
    - Emphasize research and understanding
    - Balance optimism with valuation discipline
    - Encourage long-term thinking

    Be practical and fundamental. Channel Lynch's accessible wisdom and GARP discipline.`
                }
            };
        }
        
        getMockResponses() {
                return {
                    value: `Looking at your portfolio through a value investing lens:

        **The Good:**
        Your portfolio shows strong returns (+31.95%), which is excellent. The mix of quality stocks (AAPL, GOOGL) and commodities (GLD) provides some diversification.

        **Areas for Consideration:**

        1. **Cryptocurrency Concentration (40%):** This is significantly higher than what Buffett or Munger would recommend. Crypto lacks intrinsic value and durable moats. Consider: Can you estimate BTC value 10 years from now based on cash flows? If not, it may be speculation rather than investment.

        2. **Circle of Competence:** Do you deeply understand the competitive advantages of each holding? The best investments are in businesses you can thoroughly analyze.

        3. **Margin of Safety:** At current valuations, are you buying wonderful businesses at fair prices? Or fair businesses at wonderful prices?

        **Suggestion:** Consider reducing crypto exposure to 10-15% and reallocating to quality businesses with strong competitive moats, predictable cash flows, excellent management, and trading below intrinsic value.

        Remember: Price is what you pay, value is what you get. Focus on business quality first, price second.`,

                    contrarian: `Analyzing your portfolio with a contrarian lens:

        **Current Positioning:**
        +31.95% return shows you have caught some momentum, but let us look deeper at market positioning and opportunities.

        **Observations:**

        1. **Tech Concentration (45%):** AAPL and GOOGL are consensus safe positions. Everyone owns them. Where is the edge? Consider: Are these crowded trades vulnerable to mean reversion?

        2. **Crypto at 40%:** Interesting timing. If you bought during the panic lows, excellent. If you are chasing recent gains, question your entry point.

        3. **Missing Opportunities:** Where is the blood in the streets? What sectors are everyone avoiding that could offer 3:1 risk/reward?

        **Contrarian Ideas:**

        Energy/Commodities: Only 15% in GLD. What about unloved energy names or other hard assets? Emerging Markets: Any exposure to beaten-down EM opportunities? Financials: Banks trading below book value after rate volatility?

        **Action:** Identify 1-2 sectors with extreme negative sentiment but recovering fundamentals. Size positions for asymmetry - risk 1 to make 3+.

        The best opportunities are where others fear to tread.`,

                    macro: `Portfolio Analysis - Macro Regime Perspective:

        **Current Environment Assessment:**
        We are in a regime of persistent inflation concerns, geopolitical tensions, and monetary policy uncertainty.

        **Your Portfolio Through Regime Lens:**

        **Strengths:**
        Commodities (GLD 15%): Good inflation hedge. Tech (45%): Benefits from productivity gains. Crypto (40%): Potential alternative store of value.

        **Vulnerabilities:**

        1. **Correlation Risk:** Tech + Crypto = 85% in risk assets with positive correlation. In a risk-off scenario, both decline together.

        2. **Missing Diversification:** No exposure to bonds/fixed income. No currency diversification. No defensive/counter-cyclical assets. Limited geographic diversification.

        3. **Regime Scenarios:** Stagflation: Current portfolio 50% exposed (need more real assets). Deflationary Bust: 0% protected (need bonds, cash). Growth Boom: 85% exposed (well positioned).

        **All-Weather Adjustment:**

        Consider rebalancing to: 30% Stocks (quality, diversified), 20% Bonds (duration, inflation-protected), 25% Commodities/Real Assets, 15% Crypto/Alternative, 10% Cash/Short-term.

        This balances across regimes while maintaining upside.`,

                    quant: `Quantitative Portfolio Analysis:

        **Performance Metrics:**
        Total Return: +31.95% (1 period). Holdings: 5. Concentration: High (top 2 = 85%).

        **Factor Exposure Analysis:**

        **Momentum:** HIGH - BTC +0.53%, ETH +0.99% suggest positive momentum. AAPL +0.99%, GOOGL +0.24% showing strength. Risk: Momentum reversal vulnerability.

        **Value:** UNDEFINED - Insufficient data on P/E, P/B ratios. Cannot assess value factor exposure. Recommendation: Add fundamental metrics.

        **Quality:** MODERATE - AAPL, GOOGL = high quality (strong balance sheets, ROE). Crypto = non-traditional quality metrics.

        **Volatility:** HIGH - 40% crypto allocation = elevated portfolio volatility. Estimated portfolio vol: 35-45% annualized. Sharpe ratio: 0.7-0.9 (assuming Rf = 4%).

        **Risk Concentration:**
        BTC-ETH correlation (0.9) = cluster risk. Tech correlation (0.8) = sector concentration.

        **Systematic Recommendation:**
        Add uncorrelated assets (correlation less than 0.3): Short-term bonds, REITs, International equities, Managed futures. Target: Reduce portfolio volatility to 20-25% while maintaining returns.`,

                    tech: `Portfolio Review - Disruptive Innovation Lens:

        **Exponential Exposure:**
        Good foundational positioning in AAPL and GOOGL - these are technology moats with network effects. Crypto allocation shows understanding of paradigm shifts.

        **Critical Questions:**

        1. **Zero-to-One Potential:** Where is your exposure to companies creating NEW markets vs competing in existing ones? AAPL/GOOGL = mature (sustaining innovation). Crypto = potentially zero-to-one (new monetary paradigm).

        2. **Power Law Distribution:** Your portfolio is too evenly weighted. Tech investing follows power laws - one winner can return 100x while others fail. Where is your asymmetric bet?

        3. **Missing Disruption:** AI Revolution: Where is exposure to foundational AI companies? Biotech: Gene editing, longevity companies? Space/Energy: New frontier opportunities? Web3: Beyond just crypto holdings?

        **Disruptive Gaps:**

        You are overweight MATURE tech (AAPL, GOOGL) and underweight EMERGING tech.

        **Reframe:**
        20% Mature tech (keep winners, let them run). 30% Emerging tech (AI, robotics, biotech). 20% Crypto/Web3 (infrastructure, not just tokens). 20% Commodities (real assets for balance). 10% Cash (dry powder for opportunities).

        Think: What will 10x in 10 years? Position accordingly.`,

                    growth: `Portfolio Analysis - GARP Perspective:

        **Current Holdings Review:**

        Let us evaluate through the PEG lens (PE / Growth Rate):

        **AAPL:** Assume P/E around 30, Growth around 8%. PEG = 3.75 (EXPENSIVE). Great company, but price reflects that. Rating: HOLD (quality, but not reasonable price).

        **GOOGL:** Assume P/E around 25, Growth around 12%. PEG = 2.08 (FAIR to EXPENSIVE). Better value than AAPL relatively. Rating: HOLD.

        **Crypto (BTC, ETH):** No earnings = Cannot calculate PEG. Pure speculation vs GARP approach. Rating: SPECULATIVE (reduce to under 10%).

        **GLD:** No earnings growth. Defensive holding. Rating: TACTICAL (maintain 10-15%).

        **Growth Quality Assessment:**

        Your growth exposure (Tech 45%) is priced for perfection. You are paying premium multiples for moderate growth.

        **GARP Opportunity Search:**

        Look for mid-cap companies growing 15-25% annually, trading at P/E of 15-20 (PEG under 1.3), with strong competitive positions and understandable business models.

        **Suggestions:**
        Reduce mega-cap tech to 25%. Add 3-4 mid-cap growth companies with PEG under 1. Keep crypto under 10% (too speculative for GARP). Target portfolio PEG of 1.0-1.5.

        Remember: Growth at a reasonable price, not growth at any price.`
                };
            }
    }

    // Initialize AI Advisor when DOM is ready
    let aiAdvisor;
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize after a short delay to ensure other components are ready
        setTimeout(() => {
            aiAdvisor = new AIAdvisor();
            window.aiAdvisor = aiAdvisor;
        }, 100);
    });

