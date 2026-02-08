# Changelog

All notable changes to Portfolio Tracker will be documented in this file.

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