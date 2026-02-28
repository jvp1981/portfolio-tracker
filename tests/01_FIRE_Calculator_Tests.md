# FIRE CALCULATOR - TEST SUITE
**Version:** v2.1.0-beta  
**Date:** February 2026  
**Tester:** Javier Valdepérez

---

## TEST EXECUTION TRACKER

| Test ID | Description | Status | Actual Result | Notes |
|---------|-------------|--------|---------------|-------|
| FIRE-001 | Basic calculation | ⬜ | | |
| FIRE-002 | High vs low contribution | ⬜ | | |
| FIRE-003 | BTC growth models | ⬜ | | |
| FIRE-004 | Stock allocations | ⬜ | | |
| FIRE-005 | Allocation validation | ⬜ | | |
| FIRE-006 | Zero contribution | ⬜ | | |
| FIRE-007 | Timeline selector | ⬜ | | |
| FIRE-008 | Log scale toggle | ⬜ | | |
| FIRE-009 | Monte Carlo | ⬜ | | |
| FIRE-010 | Crash scenarios | ⬜ | | |

**Legend:** ⬜ Not Started | 🟡 In Progress | ✅ Pass | ❌ Fail

---

## SETUP - Default Test Portfolio

**Use this baseline for all tests unless specified:**
```
Current Portfolio:
- BTC: $100,000
- Stocks: $50,000
- Bonds: $25,000
- Cash: $10,000
- Other: $15,000
Total: $200,000

Personal Info:
- Current Age: 35
- Annual Expenses: €40,000
```

**To load:** Go to Portfolio module first, verify these values are loaded in FIRE Calculator.

---

## TEST CASES

### FIRE-001: Basic Calculation ⬜

**Objective:** Verify basic FIRE calculation works

**Setup:**
1. Use default portfolio (above)
2. Navigate to FIRE Calculator

**Inputs:**
```
Monthly Contribution: €2,500
Contribution Allocation: BTC 30%, Stocks 50%, Bonds 15%, Cash 5%
Withdrawal Rate: 4%
BTC Growth Model: Conservative High (30% CAGR)
Stocks Allocation: 80/20 (8.5% CAGR)
Bonds Return: 4%
Inflation: CPI (2%)
Capital Gains Tax: 23%
Withdrawal Strategy: Proportional
```

**Actions:**
1. Enter all values exactly as above
2. Click "🔥 Calculate FIRE"
3. Wait for results to appear

**Expected Results:**
```
Required Portfolio: €1,000,000 (40,000 / 0.04)
Years to FIRE: 15-18 years
FIRE Age: 50-53
FIRE Year: 2041-2044
Annual Withdrawal (gross): €40,000
Annual Withdrawal (net after tax): ~€30,800
Monthly Withdrawal: ~€2,567
```

**Pass Criteria:**
- ✅ Results section appears (not hidden)
- ✅ Required Portfolio = €1,000,000 exactly
- ✅ Years to FIRE between 15-18 years
- ✅ Timeline chart renders without errors
- ✅ Allocation chart renders without errors
- ✅ No console errors

**Actual Results:**
```
Required Portfolio: €________
Years to FIRE: _____
FIRE Age: _____
Charts render: YES / NO
Console errors: YES / NO
```

**Status:** ⬜ Not Started | ✅ Pass | ❌ Fail

**Notes:**
_______________________________________________________

---

### FIRE-002: High vs Low Contribution ⬜

**Objective:** Verify higher contributions = fewer years to FIRE

**Test 2A: Low Contribution**

**Inputs:**
```
(Use default portfolio)
Monthly Contribution: €1,000  ← LOW
Allocation: BTC 40%, Stocks 60%
BTC Model: Conservative High (30%)
Stocks: 80/20 (8.5%)
Rest: defaults
```

**Expected Results:**
```
Years to FIRE: 22-26 years
```

**Actual Result:** _____ years

---

**Test 2B: High Contribution**

**Inputs:**
```
(Same as 2A except:)
Monthly Contribution: €5,000  ← HIGH
```

**Expected Results:**
```
Years to FIRE: 10-13 years
CRITICAL: Must be LESS than Test 2A
```

**Actual Result:** _____ years

**Pass Criteria:**
- ✅ Test 2A: 22-26 years
- ✅ Test 2B: 10-13 years
- ✅ Test 2B < Test 2A (CRITICAL!)
- ✅ Difference makes logical sense

**Comparison:**
```
2A (€1k/month): _____ years
2B (€5k/month): _____ years
Difference: _____ years (2B should be ~10-15 years less)
```

**Status:** ⬜ | ✅ | ❌

**Notes:**
_______________________________________________________

---

### FIRE-003: Bitcoin Growth Models ⬜

**Objective:** Different BTC models produce different results

**Test 3A: Conservative High (30%)**

**Inputs:**
```
(Default portfolio)
Monthly Contribution: €3,000
Allocation: BTC 50%, Stocks 50%
BTC Model: Conservative High (30% CAGR)  ← 
Stocks: 80/20 (8.5%)
```

**Expected:** Years to FIRE: 11-14 years

**Actual:** _____ years

---

**Test 3B: Conservative Mid (15%)**

**Inputs:**
```
(Same as 3A except:)
BTC Model: Conservative Mid (15% CAGR)  ←
```

**Expected:** Years to FIRE: 13-17 years (MORE than 3A)

**Actual:** _____ years

---

**Test 3C: Conservative Low (8%)**

**Inputs:**
```
(Same as 3A except:)
BTC Model: Conservative Low (8% CAGR)  ←
```

**Expected:** Years to FIRE: 16-20 years (MORE than 3B)

**Actual:** _____ years

---

**Test 3D: Power Law**

**Inputs:**
```
(Same as 3A except:)
BTC Model: Power Law  ←
```

**Expected:** Years to FIRE: 10-13 years (similar to or better than 3A)

**Actual:** _____ years

**Pass Criteria:**
- ✅ 3A < 3B < 3C (years increase as BTC return decreases)
- ✅ 3D competitive with 3A
- ✅ Logical progression

**Comparison Table:**
```
30% CAGR: _____ years
15% CAGR: _____ years
8% CAGR:  _____ years
Power Law: _____ years
```

**Status:** ⬜ | ✅ | ❌

---

### FIRE-004: Stock Allocation Models ⬜

**Objective:** Different stock allocations affect timeline

**Test 4A: 60/40 (Conservative)**

**Inputs:**
```
(Default portfolio)
Monthly Contribution: €3,000
Allocation: BTC 30%, Stocks 70%
BTC Model: Conservative Mid (15%)
Stocks Allocation: 60/40 (~7% CAGR)  ←
```

**Expected:** Years to FIRE: 17-21 years

**Actual:** _____ years

---

**Test 4B: 80/20 (Moderate)**

**Inputs:**
```
(Same as 4A except:)
Stocks Allocation: 80/20 (~8.5% CAGR)  ←
```

**Expected:** Years to FIRE: 15-18 years (LESS than 4A)

**Actual:** _____ years

---

**Test 4C: 100% Stocks (Aggressive)**

**Inputs:**
```
(Same as 4A except:)
Stocks Allocation: 100% Stocks (~10% CAGR)  ←
```

**Expected:** Years to FIRE: 13-16 years (LESS than 4B)

**Actual:** _____ years

---

**Test 4D: Custom Return**

**Inputs:**
```
(Same as 4A except:)
Stocks Allocation: Custom  ←
Custom Stocks Return: 12%
```

**Expected:** Years to FIRE: 11-14 years (LESS than 4C)

**Actual:** _____ years

**Pass Criteria:**
- ✅ 4A > 4B > 4C > 4D (years decrease as return increases)
- ✅ Custom input works
- ✅ Logical differences

**Status:** ⬜ | ✅ | ❌

---

### FIRE-005: Allocation Validation ⬜

**Objective:** System validates allocation totals 100%

**Test 5A: Invalid Allocation (doesn't total 100%)**

**Inputs:**
```
(Default portfolio)
Monthly Contribution: €2,000
Allocation:
  BTC: 30%
  Stocks: 40%
  Bonds: 20%
  Cash: 5%
Total: 95%  ← INVALID
```

**Actions:**
1. Enter values above
2. Click "🔥 Calculate FIRE"

**Expected Behavior:**
- ❌ Alert appears: "Contribution allocation must total 100%"
- ❌ Calculation does NOT proceed
- ✅ Allocation total shows "95%" in red/invalid state

**Actual Behavior:**
```
Alert appeared: YES / NO
Alert message: ___________________________
Calculation blocked: YES / NO
Total shows red: YES / NO
```

---

**Test 5B: Valid Allocation (totals 100%)**

**Inputs:**
```
Allocation:
  BTC: 30%
  Stocks: 40%
  Bonds: 25%
  Cash: 5%
Total: 100%  ← VALID
```

**Expected:**
- ✅ Calculation proceeds
- ✅ No alert
- ✅ Total shows green/valid

**Actual:** Calculation worked: YES / NO

**Status:** ⬜ | ✅ | ❌

---

### FIRE-006: Zero Monthly Contribution ⬜

**Objective:** Calculator works with €0 contributions (portfolio growth only)

**Inputs:**
```
(Default portfolio: $200k)
Monthly Contribution: €0  ←
Allocation: (any values, should be ignored)
BTC Model: Conservative Mid (15%)
Stocks: 80/20 (8.5%)
```

**Expected Results:**
```
Required Portfolio: €1,000,000
Years to FIRE: 25-35 years (growth only, no contributions)
Allocation validation: SKIPPED (no alert about allocation %)
```

**Actual Results:**
```
Years to FIRE: _____
Allocation alert: YES / NO (should be NO)
Calculation works: YES / NO
```

**Pass Criteria:**
- ✅ No allocation validation error
- ✅ Calculation completes
- ✅ Years make sense (longer than with contributions)

**Status:** ⬜ | ✅ | ❌

---

### FIRE-007: Timeline Selector ⬜

**Objective:** Timeline dropdown changes chart view

**Setup:**
1. Complete any basic calculation (FIRE-001)
2. Results and charts visible

**Test 7A: 10 Years**

**Actions:**
1. Select "10 Years" from dropdown
2. Observe chart

**Expected:**
- ✅ Chart re-renders
- ✅ X-axis shows Year 0 to Year 10 only
- ✅ Chart zoomed into early years
- ✅ Better visibility of initial growth

**Actual:** Chart shows _____ years on X-axis

---

**Test 7B: 20 Years**

**Expected:** Chart shows Year 0-20

**Actual:** _____

---

**Test 7C: 30 Years**

**Expected:** Chart shows Year 0-30

**Actual:** _____

---

**Test 7D: 50 Years**

**Expected:** Chart shows Year 0-50 (full projection)

**Actual:** _____

**Pass Criteria:**
- ✅ All timeline options work
- ✅ Chart updates dynamically
- ✅ No errors in console

**Status:** ⬜ | ✅ | ❌

---

### FIRE-008: Log Scale Toggle ⬜

**Objective:** Log scale checkbox changes Y-axis

**Setup:**
1. Complete calculation with long timeline (50 years)
2. Charts visible

**Test 8A: Log Scale ON (default)**

**Actions:**
1. Ensure "Log Scale" checkbox is CHECKED
2. Observe Timeline chart Y-axis

**Expected:**
- ✅ Y-axis shows logarithmic scale
- ✅ Early years growth visible
- ✅ Curve appears more linear (less extreme exponential)
- ✅ Values: $1K, $10K, $100K, $1M, $10M (powers of 10)

**Actual:**
```
Scale type: Linear / Logarithmic
Early years visible: YES / NO
Y-axis values: _______________
```

---

**Test 8B: Log Scale OFF**

**Actions:**
1. UNCHECK "Log Scale" checkbox
2. Observe chart change

**Expected:**
- ✅ Chart re-renders
- ✅ Y-axis shows linear scale
- ✅ Early years compressed (hard to see)
- ✅ Late years show dramatic exponential curve
- ✅ Values: $0, $200K, $400K, $600K... (even increments)

**Actual:**
```
Scale type: Linear / Logarithmic
Chart changed: YES / NO
Early years visible: YES / NO (should be harder)
```

**Pass Criteria:**
- ✅ Toggle works
- ✅ Clear visual difference
- ✅ Log scale better for early years visibility

**Status:** ⬜ | ✅ | ❌

---

### FIRE-009: Monte Carlo Simulation ⬜

**Objective:** Monte Carlo runs successfully and produces logical results

**Setup:**
1. Complete basic calculation (FIRE-001)
2. Results visible

**Actions:**
1. Click "📊 Run Monte Carlo Simulation"
2. Wait for completion (10-30 seconds)

**Expected Behavior:**
```
Button text changes to: "⏳ Simulating..."
Button disabled during run
After completion:
  - Alert appears with results
  - Success Rate updated
  - Years to FIRE shows P10/P50/P90
```

**Expected Results:**
```
Alert shows:
  "✅ Simulation Complete!
   10000 scenarios analyzed:
   
   • Pessimistic (P10): ____ years
   • Base Case (P50): ____ years
   • Optimistic (P90): ____ years
   
   Success Rate: ____%"

Logical constraints:
  P10 > P50 > P90 (pessimistic takes longer)
  Success Rate: 70-95%
  P50 close to original "Years to FIRE"
```

**Actual Results:**
```
Alert appeared: YES / NO
P10: _____ years
P50: _____ years
P90: _____ years
Success Rate: _____%

Order correct (P10 > P50 > P90): YES / NO
Success rate reasonable: YES / NO
```

**Pass Criteria:**
- ✅ Simulation completes without errors
- ✅ P10 > P50 > P90 (CRITICAL!)
- ✅ Success rate between 50-100%
- ✅ P50 within ±3 years of basic calculation
- ✅ Metrics card updates with scenarios

**Status:** ⬜ | ✅ | ❌

---

### FIRE-010: Crash Scenarios ⬜

**Objective:** Crash scenarios show impact on FIRE timeline

**Setup:**
1. Complete basic calculation
2. Scroll to "Scenario Analysis" section

**Expected Display:**
```
📉 Scenario Analysis

[Bear Market (-30%)]
Impact: +X years

[Severe Crash (-50%)]
Impact: +Y years

[BTC Collapse (-80%)]
Impact: +Z years
```

**Logical Constraints:**
```
X < Y < Z  (bigger crash = more years added)
X: typically 2-5 years
Y: typically 5-10 years
Z: typically 8-15 years
```

**Actual Results:**
```
Bear Market (-30%): +_____ years
Severe Crash (-50%): +_____ years
BTC Collapse (-80%): +_____ years

Order correct (X < Y < Z): YES / NO
Values reasonable: YES / NO
```

**Pass Criteria:**
- ✅ All three scenarios display
- ✅ Correct ordering (larger crash = more impact)
- ✅ Numbers make logical sense
- ✅ No negative values
- ✅ No "NaN" or errors

**Status:** ⬜ | ✅ | ❌

---

## ADDITIONAL TEST CASES

### FIRE-011: Portfolio Auto-Load ⬜

**Objective:** Current portfolio loads from Portfolio Tracker

**Actions:**
1. Go to Portfolio Tracker
2. Verify holdings exist
3. Navigate to FIRE Calculator
4. Check "Current Portfolio" section

**Expected:**
- ✅ BTC value matches Portfolio
- ✅ Stocks value matches
- ✅ Values are editable
- ✅ Total calculates correctly

**Status:** ⬜ | ✅ | ❌

---

### FIRE-012: Negative Portfolio Values ⬜

**Objective:** Handle negative values (e.g., loans)

**Inputs:**
```
Current Portfolio:
  BTC: $50,000
  Stocks: $30,000
  Other: -$20,000  ← NEGATIVE (debt/loan)
Total: $60,000
```

**Expected:**
- ✅ Total calculates correctly ($60k)
- ✅ Calculation proceeds normally
- ✅ No errors

**Status:** ⬜ | ✅ | ❌

---

### FIRE-013: Already FIRE ⬜

**Objective:** Handle case where user already has enough

**Inputs:**
```
Current Portfolio: $2,000,000  ← Already above target
Annual Expenses: €40,000
Required: €1,000,000
```

**Expected:**
```
Years to FIRE: 0 or "Already FIRE!"
Charts show minimal/no growth needed
No errors
```

**Status:** ⬜ | ✅ | ❌

---

### FIRE-014: Extreme Values ⬜

**Test extreme but valid inputs**

**Test 14A: Very High Expenses**
```
Annual Expenses: €500,000
Required Portfolio: €12,500,000
Should calculate (may take 100 years)
```

**Test 14B: Very High Contribution**
```
Monthly Contribution: €50,000
Should dramatically reduce years to FIRE
```

**Test 14C: 100 Year Old**
```
Current Age: 100
Should still calculate
FIRE Age: 100+
```

**Status:** ⬜ | ✅ | ❌

---

### FIRE-015: Chart Rendering ⬜

**Objective:** All charts render correctly

**Checklist:**
- ✅ Timeline chart appears
- ✅ Timeline chart has data
- ✅ FIRE target line visible (green dashed)
- ✅ Allocation chart appears
- ✅ All 4 asset lines visible (BTC, Stocks, Bonds, Cash)
- ✅ Colors match legend
- ✅ Tooltips work on hover
- ✅ Charts responsive (resize window)

**Status:** ⬜ | ✅ | ❌

---

## SUMMARY STATISTICS

**Total Tests:** 15 core + 5 additional = 20 tests

**Completion:**
- ✅ Passed: _____
- ❌ Failed: _____
- ⬜ Not Run: _____

**Critical Bugs Found:** _____

**Priority:**
- 🔴 Critical (blocks usage): _____
- 🟡 Major (impacts UX): _____
- 🟢 Minor (cosmetic): _____

---

## NOTES & OBSERVATIONS

### Issues Found:

1. _______________________________________________

2. _______________________________________________

3. _______________________________________________

### Suggestions:

1. _______________________________________________

2. _______________________________________________

---

**Test Session Date:** _____________
**Duration:** _____ hours
**Tester:** Javier Valdepérez
**Next Steps:** Bug fixing session