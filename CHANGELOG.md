# Changelog

All notable changes to Portfolio Tracker will be documented in this file.

## [v1.4.0] - 2026-02-11

### Added
- Auto-refresh functionality with 5-minute intervals
- Countdown timer showing next refresh time
- Toggle button for auto-refresh ON/OFF
- Visual notification on auto-refresh trigger
- Enhanced dashboard with performance insights
- Best Performer card (top gainer with %)
- Worst Performer card (biggest loser with %)
- Day Change card (total portfolio change today)
- Performance cards with gradient backgrounds
- Real-time day change calculations

### Changed
- Simplified button layout (removed redundant buttons)
- Cleaner UI with 4 essential action buttons
- Dashboard now shows 8 cards (5 main + 3 performance)
- Better visual hiera

## [v1.3.2] - 2026-02-10

### Added
- Loading overlay with animated spinner during API fetches
- Comprehensive hover effects on all interactive elements
- Summary card lift animation on hover (4px translateY)
- Table row highlight on hover with scale effect
- Button press feedback animations
- Enhanced empty state with icon and helpful tips
- Smooth transitions throughout the app (0.3s ease)

### Changed
- Summary cards now have visual depth with shadows
- Border colors change to primary blue on hover
- All buttons have lift effect on hover
- Improved visual hierarchy with consistent spacing

### Technical
- CSS custom properties for shadows (sm/md/lg)
- Transform-based animations for performance
- Backdrop blur on loading overlay
- Proper z-index stacking for overlays

### UX Improvements
- Instant visual feedback on all interactions
- Loading states show progress and estimated time
- Better perceived performance with animations
- Professional polish throughout

## [v1.3.1] - 2026-02-10 (WIP)

### Added
- Price change indicators with arrows (↑↓)
- Color-coded price movements (green/red)
- Percentage change tracking since last update
- Hover tooltip showing "Since last update"
- lastPrice tracking for comparison

### In Progress
- Pending full testing (Alpha Vantage daily limit reached)
- Will test complete flow tomorrow when API resets

## [v1.3.0] - 2026-02-09

### Added
- CoinGecko API integration for cryptocurrency prices
- Dual API system: CoinGecko (crypto) + Alpha Vantage (stocks)
- Support for 12+ cryptocurrencies (BTC, ETH, SOL, BNB, ADA, DOGE, XRP, etc.)
- Intelligent API routing based on ticker type detection
- Clear Cache button for manual cache management
- Batch crypto price fetching (all at once, instant)
- Detailed success/fail feedback with API breakdown

### Changed
- fetchRealPrices() now routes to appropriate API automatically
- Cache clearing now affects both APIs
- Error messages now indicate which API failed
- Alert messages show crypto vs stock count breakdown

### Fixed
- Crypto prices now accurate and real-time (via CoinGecko)
- Better handling of API rate limits
- Clearer user feedback when APIs unavailable

### Known Issues
- Alpha Vantage free tier limited to 25 requests/day
- Stocks fall back to mock prices when daily limit reached
- Rate limits reset at midnight UTC

## [v1.2.0] - 2026-02-08

### Added
- Real-time price integration with Alpha Vantage API
- Smart caching system (5-minute cache to avoid rate limits)
- Rate limiting (12 seconds between API requests)
- "Fetch Real Prices" button for manual price updates
- Progress feedback during batch price fetching
- Persistent real prices in localStorage
- Fallback system: Real API → Cache → Mock prices

### Changed
- getCurrentPrice() now prioritizes real prices over mock data
- Refresh button renamed to "Refresh Mock" for clarity
- PortfolioManager now accessible globally via window object

### Fixed
- Leverage calculation corrected to use Debt/NetWorth formula
- Real prices now persist correctly across page refreshes

## [v1.1.0] - 2026-02-08

### Added
- Leverage tracking with dashboard card (Debt/NetWorth %)
- Loan/Debt asset class support with negative values
- Color-coded leverage indicator (Green/Yellow/Red)
- 40+ mock tickers (stocks, crypto ETFs, commodities, bonds)
- Export portfolio to JSON with timestamp
- Import portfolio from JSON with Replace/Merge options
- Refresh Prices button (mock data simulation)
- Last Updated timestamp with auto-update every second
- Enhanced delete confirmations with position details

### Changed
- Asset Allocation pie chart excludes loans (shown separately)
- Top Holdings chart uses consistent colors by asset class
- ETF color changed from red to purple (red reserved for loans)
- Summary cards expanded to 5 (added Leverage)

## [v1.0.0] - 2026-02-07

### Added
- Initial MVP release
- Portfolio position tracking (add, edit, delete)
- Real-time portfolio metrics calculation
- Asset allocation visualization (pie chart)
- Top holdings visualization (bar chart)
- Portfolio holdings table with performance metrics
- LocalStorage persistence
- Responsive design
- Chart.js integration
- Mock price data with random fluctuation

---

**Next planned:** v1.3.0 - CoinGecko integration, auto-refresh, market status