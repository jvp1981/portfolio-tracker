/* ===================================
   PRICE API MANAGER
   Handles real-time price fetching from Alpha Vantage
   =================================== */

class PriceAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://www.alphavantage.co/query';
        this.cache = {};
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.requestCount = 0;
        this.maxRequestsPerMinute = 5; // Alpha Vantage limit
        this.lastRequestTime = null;
    }

    // Get single price
    async getPrice(ticker) {
        // Check cache first
        if (this.isCached(ticker)) {
            console.log(`📦 Cache hit: ${ticker}`);
            return this.cache[ticker].price;
        }

        // Rate limiting check
        await this.rateLimitCheck();

        // Fetch from API
        console.log(`📡 Fetching ${ticker} from Alpha Vantage...`);
        
        const url = `${this.baseURL}?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${this.apiKey}`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Check for API error messages
            if (data["Error Message"]) {
                throw new Error(`Invalid ticker: ${ticker}`);
            }
            
            if (data["Note"]) {
                // Rate limit message
                throw new Error('API rate limit reached. Please wait a minute.');
            }
            
            const quote = data["Global Quote"];
            
            if (!quote || !quote["05. price"]) {
                throw new Error(`No data available for ${ticker}`);
            }
            
            const price = parseFloat(quote["05. price"]);
            
            if (isNaN(price) || price <= 0) {
                throw new Error(`Invalid price for ${ticker}`);
            }
            
            // Cache the result
            this.cachePrice(ticker, price);
            
            this.requestCount++;
            this.lastRequestTime = Date.now();
            
            console.log(`✅ ${ticker}: $${price}`);
            return price;
            
        } catch (error) {
            console.error(`❌ Error fetching ${ticker}:`, error.message);
            return null;
        }
    }

    // Get multiple prices (with delay to avoid rate limits)
    async getMultiplePrices(tickers, onProgress = null) {
        const results = {};
        const delay = 12000; // 12 seconds between requests (5 per minute)
        
        for (let i = 0; i < tickers.length; i++) {
            const ticker = tickers[i];
            
            // Update progress
            if (onProgress) {
                onProgress(i + 1, tickers.length, ticker);
            }
            
            // Get price
            const price = await this.getPrice(ticker);
            results[ticker] = price;
            
            // Wait before next request (except on last one)
            if (i < tickers.length - 1) {
                console.log(`⏳ Waiting ${delay/1000}s before next request...`);
                await this.sleep(delay);
            }
        }
        
        return results;
    }

    // Cache management
    isCached(ticker) {
        if (!this.cache[ticker]) return false;
        
        const age = Date.now() - this.cache[ticker].timestamp;
        return age < this.cacheTimeout;
    }

    cachePrice(ticker, price) {
        this.cache[ticker] = {
            price: price,
            timestamp: Date.now()
        };
    }

    clearCache() {
        this.cache = {};
        console.log('🗑️ Price cache cleared');
    }

    // Rate limiting
    async rateLimitCheck() {
        if (!this.lastRequestTime) return;
        
        const timeSinceLastRequest = Date.now() - this.lastRequestTime;
        const minInterval = 12000; // 12 seconds minimum between requests
        
        if (timeSinceLastRequest < minInterval) {
            const waitTime = minInterval - timeSinceLastRequest;
            console.log(`⏳ Rate limit: waiting ${Math.ceil(waitTime/1000)}s...`);
            await this.sleep(waitTime);
        }
    }

    // Utility: sleep
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get cache stats
    getCacheStats() {
        const cachedTickers = Object.keys(this.cache);
        return {
            cachedCount: cachedTickers.length,
            tickers: cachedTickers,
            requestCount: this.requestCount
        };
    }
}

// Create global instance
const priceAPI = new PriceAPI('PCBF18LU483HTMS5');