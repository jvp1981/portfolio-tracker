/* ===================================
   COINGECKO API MANAGER
   Handles cryptocurrency price fetching
   =================================== */

class CoinGeckoAPI {
    constructor() {
        this.baseURL = 'https://api.coingecko.com/api/v3';
        this.cache = {};
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        
        // Map ticker symbols to CoinGecko IDs
        this.tickerToCoinId = {
            'BTC': 'bitcoin',
            'BTC-USD': 'bitcoin',
            'ETH': 'ethereum',
            'ETH-USD': 'ethereum',
            'SOL': 'solana',
            'SOL-USD': 'solana',
            'BNB': 'binancecoin',
            'BNB-USD': 'binancecoin',
            'ADA': 'cardano',
            'ADA-USD': 'cardano',
            'DOGE': 'dogecoin',
            'DOGE-USD': 'dogecoin',
            'XRP': 'ripple',
            'XRP-USD': 'ripple',
            'DOT': 'polkadot',
            'DOT-USD': 'polkadot',
            'MATIC': 'matic-network',
            'MATIC-USD': 'matic-network',
            'AVAX': 'avalanche-2',
            'AVAX-USD': 'avalanche-2',
            'LINK': 'chainlink',
            'LINK-USD': 'chainlink',
            'UNI': 'uniswap',
            'UNI-USD': 'uniswap'
        };
    }

    // Check if ticker is a crypto
    isCrypto(ticker) {
        return this.tickerToCoinId.hasOwnProperty(ticker.toUpperCase());
    }

    // Get CoinGecko ID from ticker
    getCoinId(ticker) {
        return this.tickerToCoinId[ticker.toUpperCase()];
    }

    // Get single crypto price
    async getPrice(ticker) {
        const coinId = this.getCoinId(ticker);
        
        if (!coinId) {
            console.error(`❌ Unknown crypto ticker: ${ticker}`);
            return null;
        }

        // Check cache first
        if (this.isCached(coinId)) {
            console.log(`📦 Cache hit (CoinGecko): ${ticker}`);
            return this.cache[coinId].price;
        }

        // Fetch from API
        console.log(`🪙 Fetching ${ticker} from CoinGecko...`);
        
        const url = `${this.baseURL}/simple/price?ids=${coinId}&vs_currencies=usd`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!data[coinId] || !data[coinId].usd) {
                throw new Error(`No price data for ${ticker}`);
            }
            
            const price = data[coinId].usd;
            
            // Cache the result
            this.cachePrice(coinId, price);
            
            console.log(`✅ ${ticker}: $${price.toLocaleString()}`);
            return price;
            
        } catch (error) {
            console.error(`❌ Error fetching ${ticker} from CoinGecko:`, error.message);
            return null;
        }
    }

    // Get multiple crypto prices at once
    async getMultiplePrices(tickers) {
        const cryptoTickers = tickers.filter(t => this.isCrypto(t));
        
        if (cryptoTickers.length === 0) {
            return {};
        }

        // Get unique coin IDs
        const coinIds = [...new Set(cryptoTickers.map(t => this.getCoinId(t)))];
        
        console.log(`🪙 Fetching ${cryptoTickers.length} cryptos from CoinGecko...`);
        
        const url = `${this.baseURL}/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            // Map back to tickers
            const results = {};
            
            cryptoTickers.forEach(ticker => {
                const coinId = this.getCoinId(ticker);
                if (data[coinId] && data[coinId].usd) {
                    results[ticker] = data[coinId].usd;
                    this.cachePrice(coinId, data[coinId].usd);
                    console.log(`✅ ${ticker}: $${data[coinId].usd.toLocaleString()}`);
                }
            });
            
            return results;
            
        } catch (error) {
            console.error('❌ Error fetching from CoinGecko:', error.message);
            return {};
        }
    }

    // Cache management
    isCached(coinId) {
        if (!this.cache[coinId]) return false;
        
        const age = Date.now() - this.cache[coinId].timestamp;
        return age < this.cacheTimeout;
    }

    cachePrice(coinId, price) {
        this.cache[coinId] = {
            price: price,
            timestamp: Date.now()
        };
    }

    clearCache() {
        this.cache = {};
        console.log('🗑️ CoinGecko cache cleared');
    }

    // Get cache stats
    getCacheStats() {
        const cachedCoins = Object.keys(this.cache);
        return {
            cachedCount: cachedCoins.length,
            coins: cachedCoins
        };
    }
}

// Create global instance
window.coinGeckoAPI = new CoinGeckoAPI();
const coinGeckoAPI = window.coinGeckoAPI;