# INTEGRATION TESTS - Cross-Module Functionality
**Version:** v2.1.0-beta  
**Date:** February 2026  
**Tester:** Javier Valdepérez

---

## TEST EXECUTION TRACKER

| Test ID | Description | Status | Notes |
|---------|-------------|--------|-------|
| INT-001 | Portfolio → FIRE data flow | ⬜ | |
| INT-002 | Portfolio → AI context | ⬜ | |
| INT-003 | Navigation flow | ⬜ | |
| INT-004 | Settings persistence | ⬜ | |
| INT-005 | Multi-module workflow | ⬜ | |
| INT-006 | Data consistency | ⬜ | |
| INT-007 | Cross-module updates | ⬜ | |
| INT-008 | Performance | ⬜ | |
| INT-009 | Error propagation | ⬜ | |
| INT-010 | Full user journey | ⬜ | |

---

## INT-001: Portfolio → FIRE Data Flow ⬜

**Objective:** FIRE Calculator loads portfolio data

**Setup:**
1. Go to Portfolio Tracker
2. Add positions:
```
   AAPL: $50,000
   BTC: $100,000
   Bonds: $30,000
   Total: $180,000
```
3. Navigate to FIRE Calculator

**Expected in FIRE Calculator:**
```
Current Portfolio section shows:
- Bitcoin: $100,000
- Stocks: $50,000
- Bonds: $30,000
- Cash: $0
- Other: $0
- Total: $180,000
```

**Actual:**
```
Values match Portfolio: YES / NO
BTC: $_____ (expected: $100k)
Stocks: $_____ (expected: $50k)
Bonds: $_____ (expected: $30k)
Total: $_____ (expected: $180k)
```

**Status:** ⬜ | ✅ | ❌

---

## INT-002: Portfolio → AI Context ⬜

**Objective:** AI Advisor receives portfolio data

**Setup:**
1. Portfolio has specific holdings:
```
   TSLA: 50 shares
   NVDA: 30 shares
   BTC: 1.5 BTC
```
2. Go to AI Advisor
3. Ask: "What are my holdings?"

**Expected Response:**
- ✅ Mentions TSLA, NVDA, BTC specifically
- ✅ May include quantities or values
- ✅ Accurate to Portfolio data

**Actual:**
```
AI mentions holdings: YES / NO
Holdings mentioned: _______________
Accurate: YES / NO
```

**Status:** ⬜ | ✅ | ❌

---

## INT-003: Navigation Flow ⬜

**Objective:** Navigation between modules works

**Test All Transitions:**

**Portfolio → AI Advisor:**
- ✅ Click AI Advisor button
- ✅ View switches
- ✅ AI Advisor loads
- ✅ Portfolio button no longer active

**AI Advisor → FIRE Calc:**
- ✅ Click FIRE Calc
- ✅ View switches
- ✅ FIRE loads
- ✅ Previous data intact

**FIRE Calc → Portfolio:**
- ✅ Click Portfolio
- ✅ Returns to Portfolio
- ✅ Holdings still there

**Test All 6 Combinations:**
```
Portfolio → AI: ✅/❌
Portfolio → FIRE: ✅/❌
AI → Portfolio: ✅/❌
AI → FIRE: ✅/❌
FIRE → Portfolio: ✅/❌
FIRE → AI: ✅/❌
```

**Status:** ⬜ | ✅ | ❌

---

## INT-004: Settings Persistence ⬜

**Objective:** Settings apply across modules

**Test 4A: AI Advisor Settings**

**Actions:**
1. Go to Settings
2. Toggle "Use Real API" to ON
3. Close settings
4. Go to AI Advisor, send message
5. Navigate away, come back
6. Send another message

**Expected:**
- ✅ Setting persists
- ✅ Still using Real API after navigation

---

**Test 4B: Settings After Refresh**

**Actions:**
1. Set "Use Real API" to ON
2. Refresh page (F5)
3. Go to AI Advisor
4. Send message

**Expected:**
- ✅ Setting still ON
- ✅ Uses Real API

**Status:** ⬜ | ✅ | ❌

---

## INT-005: Multi-Module Workflow ⬜

**Objective:** Complete user journey works

**Scenario:**

**1. Build Portfolio**
- Add 5 positions
- Verify metrics

**2. Check FIRE Status**
- Navigate to FIRE
- Verify portfolio auto-loaded
- Calculate FIRE

**3. Get AI Advice**
- Navigate to AI
- Ask for portfolio analysis
- Verify AI sees holdings

**4. Return to Portfolio**
- Navigate back
- Verify holdings intact

**Expected:**
- ✅ All steps work
- ✅ Data flows correctly
- ✅ No data loss
- ✅ Smooth UX

**Status:** ⬜ | ✅ | ❌

---

## INT-006: Data Consistency ⬜

**Objective:** Same data across modules

**Test:**

**Add to Portfolio:**
```
Total Value: $250,000
```

**Check in FIRE Calculator:**
```
Current Portfolio Total: Should show $250,000
```

**Ask AI Advisor:**
```
"What is my total portfolio value?"
AI should respond: $250,000
```

**Now Edit Portfolio:**
- Add new position worth $50k
- New total: $300k

**Check FIRE again:**
- ✅ Should update to $300k

**Ask AI again:**
- ✅ Should now say $300k

**Expected:**
- ✅ All modules show same total
- ✅ Updates propagate

**Status:** ⬜ | ✅ | ❌

---

## INT-007: Cross-Module Updates ⬜

**Objective:** Changes in one module affect others

**Test:**

**1. Delete position from Portfolio**
- Portfolio total decreases

**2. Go to FIRE**
- ✅ Current portfolio reflects deletion

**3. Go to AI**
- ✅ AI no longer mentions deleted holding

**Status:** ⬜ | ✅ | ❌

---

## INT-008: Performance ⬜

**Objective:** App performs well across modules

**Metrics:**

**Initial Load:**
- Time to interactive: _____ seconds (< 3s ideal)

**Navigation Speed:**
- Portfolio → AI: _____ ms (< 500ms ideal)
- AI → FIRE: _____ ms
- FIRE → Portfolio: _____ ms

**Data Loading:**
- Portfolio data to FIRE: _____ ms (< 1s)
- Portfolio data to AI: _____ ms (< 1s)

**Overall:**
- Smooth: YES / NO
- No lag: YES / NO
- No freezes: YES / NO

**Status:** ⬜ | ✅ | ❌

---

## INT-009: Error Propagation ⬜

**Objective:** Errors in one module don't crash others

**Test:**

**1. Cause error in Portfolio**
- Add invalid data or trigger error

**2. Navigate to AI Advisor**
- ✅ AI still works
- ✅ No console errors

**3. Navigate to FIRE**
- ✅ FIRE still works (maybe with default data)

**Expected:**
- ✅ Modules isolated
- ✅ One error doesn't cascade

**Status:** ⬜ | ✅ | ❌

---

## INT-010: Full User Journey ⬜

**Objective:** Complete realistic workflow

**Journey:**

**Day 1: Setup**
1. Open app for first time
2. Add 10 positions to Portfolio
3. Export data as backup
4. Navigate to FIRE
5. Calculate FIRE (23 years)
6. Run Monte Carlo
7. Navigate to AI Advisor
8. Select Value style
9. Get portfolio analysis
10. Close browser

**Day 2: Return**
1. Reopen app
2. Portfolio still there
3. Add new position
4. Go to FIRE
5. Recalculate (now 20 years - improved!)
6. Go to AI
7. Ask about new position
8. AI knows about it

**Expected:**
- ✅ No data loss overnight
- ✅ All features work
- ✅ Updates flow through
- ✅ Smooth UX throughout

**Actual:**
```
Data persisted: YES / NO
Features work: YES / NO
Updates flow: YES / NO
UX smooth: YES / NO

Issues encountered:
_________________________________
```

**Status:** ⬜ | ✅ | ❌

---

## SUMMARY

**Total Integration Tests:** 10

**Completion:**
- ✅ Passed: _____
- ❌ Failed: _____

**Critical Issues:** _____

**Overall Integration Health:** _____/10

---

**Tester:** Javier Valdepérez  
**Date:** _____________