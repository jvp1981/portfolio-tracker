# PORTFOLIO TRACKER - TEST SUITE
**Version:** v1.5.0  
**Date:** February 2026  
**Tester:** Javier Valdepérez

---

## TEST EXECUTION TRACKER

| Test ID | Description | Status | Notes |
|---------|-------------|--------|-------|
| PORT-001 | Add new position | ⬜ | |
| PORT-002 | Edit position | ⬜ | |
| PORT-003 | Delete position | ⬜ | |
| PORT-004 | Price fetch (stocks) | ⬜ | |
| PORT-005 | Price fetch (crypto) | ⬜ | |
| PORT-006 | Auto-refresh | ⬜ | |
| PORT-007 | Metrics calculation | ⬜ | |
| PORT-008 | Performance insights | ⬜ | |
| PORT-009 | Charts render | ⬜ | |
| PORT-010 | Export data | ⬜ | |
| PORT-011 | Import data | ⬜ | |
| PORT-012 | Leverage tracking | ⬜ | |
| PORT-013 | Multiple asset classes | ⬜ | |
| PORT-014 | Negative values (loans) | ⬜ | |
| PORT-015 | Edge cases | ⬜ | |

---

## TEST CASES

### PORT-001: Add New Position ⬜

**Objective:** Can add positions successfully

**Test 1A: Add Stock**

**Actions:**
1. Click "+ Add Position"
2. Fill form:
```
   Ticker: AAPL
   Asset Class: Stocks
   Quantity: 100
   Purchase Price: $150
   Purchase Date: 2024-01-15
```
3. Click "Add Position"

**Expected:**
- ✅ Modal closes
- ✅ New row appears in table
- ✅ Ticker shows: AAPL
- ✅ Current price fetches automatically
- ✅ Gain/Loss calculates
- ✅ Allocation % updates
- ✅ Total portfolio value increases

**Actual:**
```
Position added: YES / NO
Price fetched: YES / NO (value: $_____)
Calculations correct: YES / NO
```

---

**Test 1B: Add Crypto**

**Fill:**
```
Ticker: BTC
Asset Class: Crypto
Quantity: 2.5
Purchase Price: $40,000
Purchase Date: 2023-06-01
```

**Expected:**
- ✅ BTC appears
- ✅ Price from CoinGecko
- ✅ Large gains visible (if current > $40k)

---

**Test 1C: Add Bond**

**Fill:**
```
Ticker: US10Y
Asset Class: Bonds
Quantity: 10
Purchase Price: $95
```

**Expected:**
- ✅ Bonds category works
- ✅ Price may be manual (bonds not auto-fetch)

**Status:** ⬜ | ✅ | ❌

---

### PORT-002: Edit Position ⬜

**Setup:**
1. Ensure AAPL position exists from PORT-001

**Actions:**
1. Click "Edit" on AAPL row
2. Change quantity: 100 → 150
3. Click "Save"

**Expected:**
- ✅ Modal closes
- ✅ Quantity updates to 150
- ✅ Total value recalculates (150 × current price)
- ✅ Allocation % updates
- ✅ Charts update

**Actual:**
```
Quantity updated: YES / NO
Value recalculated: YES / NO
Correct math: YES / NO
```

**Status:** ⬜ | ✅ | ❌

---

### PORT-003: Delete Position ⬜

**Actions:**
1. Click "Delete" on AAPL position
2. Confirm deletion

**Expected:**
- ✅ Confirmation dialog appears
- ✅ After confirm, row disappears
- ✅ Total portfolio value decreases
- ✅ Allocation % recalculates
- ✅ Charts update
- ✅ Performance insights update

**Status:** ⬜ | ✅ | ❌

---

### PORT-004: Price Fetch (Stocks) ⬜

**Objective:** Alpha Vantage API fetches stock prices

**Test:**

**Add positions:**
```
1. MSFT (Microsoft)
2. GOOGL (Google)
3. TSLA (Tesla)
```

**Expected for each:**
- ✅ Current price appears within 5 seconds
- ✅ Price is reasonable (not $0, not crazy high)
- ✅ Price updates icon shows (↑ green or ↓ red)
- ✅ % change displays

**Actual Results:**
```
MSFT: $_____ (fetched: YES/NO, time: ___s)
GOOGL: $_____ (fetched: YES/NO, time: ___s)
TSLA: $_____ (fetched: YES/NO, time: ___s)
```

**If Price Fetch Fails:**
```
Error message: ___________________________
Can manually enter price: YES / NO
```

**Status:** ⬜ | ✅ | ❌

---

### PORT-005: Price Fetch (Crypto) ⬜

**Objective:** CoinGecko API fetches crypto prices

**Test:**

**Add positions:**
```
1. BTC (Bitcoin)
2. ETH (Ethereum)
3. SOL (Solana)
```

**Expected:**
- ✅ Prices fetch from CoinGecko
- ✅ Prices accurate (check coinmarketcap.com to verify)
- ✅ Updates visible

**Actual:**
```
BTC: $_____ (expected: ~$_____ from CMC)
ETH: $_____ (expected: ~$_____)
SOL: $_____ (expected: ~$_____)

Prices match market: YES / NO
```

**Status:** ⬜ | ✅ | ❌

---

### PORT-006: Auto-Refresh ⬜

**Objective:** Prices auto-update every 5 minutes

**Setup:**
1. Have 3-4 positions with prices loaded
2. Note current prices and time

**Actions:**
1. Wait 5 minutes (or adjust interval in settings if available)
2. Observe

**Expected:**
- ✅ After 5 min, prices refresh automatically
- ✅ Visual indicator shows refresh happening
- ✅ Prices update (may change slightly)
- ✅ No page refresh needed
- ✅ "Last updated" timestamp updates

**Actual:**
```
Auto-refresh works: YES / NO
Interval: _____ minutes
Prices updated: YES / NO
Visual indicator: YES / NO
```

**Status:** ⬜ | ✅ | ❌

---

### PORT-007: Metrics Calculation ⬜

**Objective:** Portfolio metrics calculate correctly

**Test Setup:**

**Add these exact positions:**
```
1. AAPL: 100 shares @ $150 buy price
   Current price: $180 (manual if needed)

2. BTC: 1.0 BTC @ $30,000 buy price
   Current price: $60,000 (manual if needed)
```

**Expected Calculations:**

**AAPL:**
```
Invested: 100 × $150 = $15,000
Current Value: 100 × $180 = $18,000
Gain/Loss: $3,000
Return %: +20%
```

**BTC:**
```
Invested: 1 × $30,000 = $30,000
Current Value: 1 × $60,000 = $60,000
Gain/Loss: $30,000
Return %: +100%
```

**Portfolio Totals:**
```
Total Invested: $45,000
Total Current: $78,000
Total Gain/Loss: $33,000
Total Return %: +73.33%

Allocation:
- AAPL: 23.08% ($18k/$78k)
- BTC: 76.92% ($60k/$78k)
```

**Actual Results:**
```
AAPL Gain: $_____ (expected: $3,000)
AAPL Return: _____% (expected: +20%)

BTC Gain: $_____ (expected: $30,000)
BTC Return: _____% (expected: +100%)

Total Invested: $_____ (expected: $45,000)
Total Current: $_____ (expected: $78,000)
Total Return: _____% (expected: +73.33%)

AAPL Allocation: _____% (expected: 23.08%)
BTC Allocation: _____% (expected: 76.92%)

All calculations correct: YES / NO
```

**Status:** ⬜ | ✅ | ❌

---

### PORT-008: Performance Insights ⬜

**Objective:** 8 insight cards display correctly

**Expected Cards:**

**With test portfolio (AAPL + BTC from PORT-007):**
```
1. Total Value: $78,000
2. Total Invested: $45,000
3. Total Gain/Loss: $33,000 (green, +73.33%)
4. Best Performer: BTC (+100%)
5. Worst Performer: AAPL (+20%) [still positive, but lower]
6. Largest Holding: BTC (76.92%)
7. Asset Allocation: 2 classes (Stocks, Crypto)
8. Leverage: 0% (no loans)
```

**Actual Display:**
```
Card 1 - Total Value: $_____ ✅/❌
Card 2 - Invested: $_____ ✅/❌
Card 3 - Gain/Loss: $_____ (color: ___) ✅/❌
Card 4 - Best Performer: _____ ✅/❌
Card 5 - Worst Performer: _____ ✅/❌
Card 6 - Largest Holding: _____ ✅/❌
Card 7 - Asset Allocation: _____ ✅/❌
Card 8 - Leverage: _____% ✅/❌
```

**Status:** ⬜ | ✅ | ❌

---

### PORT-009: Charts Render ⬜

**Objective:** All charts display correctly

**Expected Charts:**

**1. Asset Allocation Pie Chart**
- ✅ Shows 2 slices (AAPL, BTC)
- ✅ BTC slice larger (76.92%)
- ✅ Labels visible
- ✅ Legend shows both assets
- ✅ Colors distinct

**2. Top Holdings Bar Chart**
- ✅ Shows top 5 holdings (or all if < 5)
- ✅ BTC tallest bar ($60k)
- ✅ AAPL shorter bar ($18k)
- ✅ Values on hover

**Actual:**
```
Pie chart renders: YES / NO
Pie chart accurate: YES / NO
Bar chart renders: YES / NO
Bar chart accurate: YES / NO
Charts responsive: YES / NO (resize window to test)
```

**Status:** ⬜ | ✅ | ❌

---

### PORT-010: Export Data ⬜

**Objective:** Can export portfolio to JSON

**Actions:**
1. Click "Export" button (if available)
2. Save file

**Expected:**
- ✅ JSON file downloads
- ✅ Filename: portfolio_YYYY-MM-DD.json
- ✅ File contains all positions
- ✅ File is valid JSON

**File Contents Check:**
```json
{
  "positions": [
    {
      "ticker": "AAPL",
      "assetClass": "Stocks",
      "quantity": 100,
      "purchasePrice": 150,
      ...
    },
    {
      "ticker": "BTC",
      ...
    }
  ],
  "exportDate": "2026-02-XX"
}
```

**Actual:**
```
Export works: YES / NO
File downloads: YES / NO
Valid JSON: YES / NO
All data present: YES / NO
```

**Status:** ⬜ | ✅ | ❌

---

### PORT-011: Import Data ⬜

**Objective:** Can import previously exported data

**Setup:**
1. Export current portfolio (PORT-010)
2. Delete all positions
3. Verify portfolio empty

**Actions:**
1. Click "Import" button
2. Select exported JSON file
3. Confirm import

**Expected:**
- ✅ Positions restore completely
- ✅ All data intact (quantities, prices, dates)
- ✅ Metrics recalculate
- ✅ Charts update
- ✅ No duplicates

**Actual:**
```
Import successful: YES / NO
Data restored: YES / NO
No duplicates: YES / NO
Metrics correct: YES / NO
```

**Status:** ⬜ | ✅ | ❌

---

### PORT-012: Leverage Tracking ⬜

**Objective:** Leverage calculated correctly with loans

**Test:**

**Add loan:**
```
Ticker: MARGIN
Asset Class: Loan
Quantity: 1
Purchase Price: -$20,000 (negative!)
```

**With existing portfolio ($78k from PORT-007):**

**Expected Calculation:**
```
Portfolio Value: $78,000
Loan (negative): -$20,000
Net Value: $58,000

Leverage: ($20,000 / $78,000) × 100 = 25.64%
```

**Or alternatively:**
```
Leverage: ($20,000 / $58,000) × 100 = 34.48%
```
*(Verify which formula app uses)*

**Actual:**
```
Loan appears: YES / NO
Loan shows negative: YES / NO
Leverage %: _____% 
Leverage card updates: YES / NO
Calculation method: (loan/gross) or (loan/net)
```

**Status:** ⬜ | ✅ | ❌

---

### PORT-013: Multiple Asset Classes ⬜

**Objective:** All asset classes work correctly

**Add one of each:**
```
1. AAPL (Stocks)
2. BTC (Crypto)
3. US10Y (Bonds)
4. GLD (Commodity)
5. VWCE (ETF)
6. MARGIN (Loan - negative)
```

**Expected:**
- ✅ All 6 appear in table
- ✅ Asset Allocation chart shows all classes
- ✅ Each color-coded differently
- ✅ Loan shows negative value
- ✅ Totals calculated correctly

**Status:** ⬜ | ✅ | ❌

---

### PORT-014: Negative Values (Loans) ⬜

**Objective:** Handle negative values correctly

**Test:**

**Scenario:**
```
Assets: $100,000
Loan: -$30,000
Net: $70,000
```

**Expected Display:**
```
Total Value card: $70,000 (net)
OR shows both: Assets $100k, Liabilities -$30k
Loan row: Shows in red or with minus sign
Charts: Handle negative appropriately
```

**Status:** ⬜ | ✅ | ❌

---

### PORT-015: Edge Cases ⬜

**Test 15A: Zero Quantity**

**Add position with quantity = 0**

**Expected:**
- ⚠️ Validation error OR
- ✅ Allows but shows $0 value

---

**Test 15B: Empty Portfolio**

**Delete all positions**

**Expected:**
- ✅ Shows "No positions" message
- ✅ Metrics show $0
- ✅ Charts empty or show "No data"
- ✅ No errors

---

**Test 15C: Duplicate Tickers**

**Add AAPL twice**

**Expected:**
- ✅ Both positions appear separately OR
- ⚠️ Warning about duplicate OR
- ✅ Combines into one position

**Which behavior:** _______________

---

**Test 15D: Invalid Ticker**

**Add ticker: "XXXINVALIDXXX"**

**Expected:**
- ⚠️ Price fetch fails gracefully
- ✅ Can manually enter price
- ✅ Position still saves

**Status:** ⬜ | ✅ | ❌

---

## ADDITIONAL TESTS

### PORT-016: Price Update Indicators ⬜

**Objective:** Up/down arrows show correctly

**Actions:**
1. Note current prices
2. Wait for auto-refresh or manual refresh
3. Observe arrows

**Expected:**
- ✅ Green ↑ for price increase
- ✅ Red ↓ for price decrease
- ✅ Gray — for unchanged

**Status:** ⬜ | ✅ | ❌

---

### PORT-017: Sorting & Filtering ⬜

**If table has sort functionality:**

**Test:**
- ✅ Sort by ticker (A-Z, Z-A)
- ✅ Sort by value (high to low)
- ✅ Sort by gain/loss
- ✅ Filter by asset class

**Status:** ⬜ | ✅ | ❌

---

### PORT-018: Mobile Responsive ⬜

**Resize to mobile:**
- ✅ Table scrolls horizontally or stacks
- ✅ Charts resize
- ✅ Buttons accessible
- ✅ Forms usable

**Status:** ⬜ | ✅ | ❌

---

### PORT-019: Performance with Many Positions ⬜

**Add 20+ positions**

**Expected:**
- ✅ Page loads quickly
- ✅ Charts render without lag
- ✅ Calculations instant
- ✅ No freezing

**Status:** ⬜ | ✅ | ❌

---

### PORT-020: localStorage Persistence ⬜

**Actions:**
1. Add several positions
2. Refresh page (F5)

**Expected:**
- ✅ All positions still there
- ✅ No data loss

**Then:**
1. Close browser completely
2. Reopen, go to app

**Expected:**
- ✅ Positions still persist

**Status:** ⬜ | ✅ | ❌

---

## SUMMARY

**Total Tests:** 20

**Completion:**
- ✅ Passed: _____
- ❌ Failed: _____

**Critical Bugs:** _____

---

**Tester:** Javier Valdepérez  
**Date:** _____________