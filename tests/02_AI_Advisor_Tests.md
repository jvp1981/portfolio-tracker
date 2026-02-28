# AI ADVISOR - TEST SUITE
**Version:** v2.0.0  
**Date:** February 2026  
**Tester:** Javier Valdepérez

---

## TEST EXECUTION TRACKER

| Test ID | Description | Status | Notes |
|---------|-------------|--------|-------|
| AI-001 | Style selection UI | ⬜ | |
| AI-002 | Value advisor response | ⬜ | |
| AI-003 | Contrarian advisor | ⬜ | |
| AI-004 | Macro advisor | ⬜ | |
| AI-005 | Quant advisor | ⬜ | |
| AI-006 | Tech advisor | ⬜ | |
| AI-007 | Growth advisor | ⬜ | |
| AI-008 | Quick actions | ⬜ | |
| AI-009 | Chat input/output | ⬜ | |
| AI-010 | Portfolio context | ⬜ | |
| AI-011 | Real API toggle | ⬜ | |
| AI-012 | Mock vs Real responses | ⬜ | |
| AI-013 | Style switching | ⬜ | |
| AI-014 | Loading states | ⬜ | |
| AI-015 | Error handling | ⬜ | |

**Legend:** ⬜ Not Started | ✅ Pass | ❌ Fail

---

## SETUP - Test Portfolio for AI

**Go to Portfolio Tracker and ensure you have:**
```
Holdings (example):
- AAPL (Stocks): $100,000
- GOOGL (Stocks): $80,000
- BTC (Crypto): $150,000
- ETH (Crypto): $50,000
- GLD (Commodity): $40,000

Total: $420,000

Asset Allocation:
- Stocks: 43%
- Crypto: 48%
- Commodities: 9%
```

**Note:** AI should reference these specific holdings in responses.

---

## TEST CASES

### AI-001: Style Selection UI ⬜

**Objective:** All 6 investment styles are selectable

**Actions:**
1. Navigate to AI Advisor
2. Observe style selector cards

**Expected Display:**
```
6 cards visible:
1. 💎 Value / Quality (Buffett, Munger, Ackman, Marks)
2. 🎯 Contrarian / Opportunistic (Tepper, Druckenmiller)
3. 🌍 Macro / Global (Dalio, Paul Tudor Jones)
4. 🔢 Quant / Systematic (Jim Simons)
5. 🚀 Tech / Disruptive (Thiel, Chamath)
6. 📈 Growth (GARP) (Peter Lynch)
```

**Test Each Card:**

**Click Value card:**
- ✅ Card highlights (blue border/glow)
- ✅ "Selected: 💎 Value / Quality" appears
- ✅ Welcome message changes to Value advisor
- ✅ Quick actions appear

**Click Contrarian card:**
- ✅ Value card de-highlights
- ✅ Contrarian highlights
- ✅ Selected indicator updates
- ✅ Welcome message changes

**Repeat for all 6 styles**

**Pass Criteria:**
- ✅ All 6 cards render correctly
- ✅ Only one card highlighted at a time
- ✅ Selected indicator updates
- ✅ Welcome message changes per style
- ✅ No console errors

**Actual Results:**
```
Cards render correctly: YES / NO
Selection works: YES / NO
Messages update: YES / NO
Console errors: YES / NO
```

**Status:** ⬜ | ✅ | ❌

---

### AI-002: Value Advisor Response ⬜

**Objective:** Value advisor gives style-appropriate analysis

**Setup:**
1. Select **Value / Quality** style
2. Ensure test portfolio loaded (AAPL, GOOGL, BTC, ETH, GLD)

**Actions:**
1. Click "Analyze Portfolio" quick action
2. Wait for response

**Expected Response Characteristics:**

**Should INCLUDE:**
- ✅ Mentions of "intrinsic value", "margin of safety", "moat"
- ✅ References to Buffett/Munger philosophy
- ✅ Criticism of crypto concentration (48%)
- ✅ Praise for quality stocks (AAPL, GOOGL)
- ✅ Questions about "circle of competence"
- ✅ Long-term perspective
- ✅ Conservative tone

**Should MENTION specific holdings:**
- ✅ "AAPL" or "Apple"
- ✅ "GOOGL" or "Google"
- ✅ "BTC" or "Bitcoin"
- ✅ Crypto percentage (48%)

**Should NOT include:**
- ❌ Macro/economic cycle language (that's Dalio)
- ❌ Statistical/quant jargon (that's Simons)
- ❌ "Zero to one" or disruption talk (that's Thiel)

**Actual Response Analysis:**
```
Response received: YES / NO
Response length: _____ words (should be 150-300)

Mentions intrinsic value: YES / NO
Mentions specific holdings: YES / NO
Tone appropriate: YES / NO
Style-specific language: YES / NO

Response quality (1-10): _____
```

**Sample Expected Response:**
```
"Looking at your portfolio through a value investing lens:

Your crypto concentration (48%) is significantly higher than 
Buffett would recommend. Bitcoin lacks intrinsic value and 
durable moats. Can you estimate BTC's value 10 years from 
now based on cash flows?

Your quality stocks (AAPL, GOOGL) at 43% show good judgment. 
These are wonderful businesses with competitive advantages.

Suggestion: Reduce crypto to 10-15% and increase quality 
businesses with pricing power and high returns on capital.

Remember: Price is what you pay, value is what you get."
```

**Status:** ⬜ | ✅ | ❌

---

### AI-003: Contrarian Advisor ⬜

**Objective:** Contrarian style gives different perspective

**Setup:**
1. Select **Contrarian / Opportunistic** style
2. Same test portfolio

**Actions:**
1. Click "Analyze Portfolio"
2. Compare response to AI-002

**Expected Characteristics:**

**Should INCLUDE:**
- ✅ "Asymmetric risk/reward" language
- ✅ Questions about entry timing
- ✅ "Buy fear, sell greed" mentality
- ✅ Discussion of consensus trades
- ✅ Bold, decisive tone
- ✅ Mentions of Tepper or Druckenmiller

**Should DIFFER from Value:**
- ✅ More aggressive stance
- ✅ Less focus on intrinsic value
- ✅ More focus on positioning and sentiment
- ✅ Discusses market dislocations

**Actual Response:**
```
Tone different from Value: YES / NO
Mentions asymmetry: YES / NO
Contrarian perspective clear: YES / NO
Response quality (1-10): _____
```

**Status:** ⬜ | ✅ | ❌

---

### AI-004: Macro / Global Advisor ⬜

**Setup:**
1. Select **Macro / Global** style

**Expected Characteristics:**

**Should INCLUDE:**
- ✅ "Correlation risk" analysis
- ✅ Economic regime discussion
- ✅ Diversification recommendations
- ✅ "All-weather" portfolio concept
- ✅ Risk parity mentions
- ✅ Systematic, framework-driven tone
- ✅ References to Dalio or PTJ

**Should ANALYZE:**
- ✅ Portfolio correlation structure
- ✅ Exposure to different economic scenarios
- ✅ Geographic diversification gaps
- ✅ Inflation/deflation positioning

**Status:** ⬜ | ✅ | ❌

---

### AI-005: Quant / Systematic Advisor ⬜

**Setup:**
1. Select **Quant / Systematic** style

**Expected Characteristics:**

**Should INCLUDE:**
- ✅ Statistical metrics (Sharpe ratio, correlation, volatility)
- ✅ Factor analysis mentions
- ✅ Data-driven language
- ✅ Numerical precision
- ✅ Minimizes narratives, emphasizes numbers
- ✅ References to Simons or Renaissance

**Should ANALYZE:**
- ✅ Portfolio volatility estimate
- ✅ Correlation matrix discussion
- ✅ Factor exposures (momentum, value, quality)
- ✅ Risk concentration metrics

**Example Expected Output:**
```
"Quantitative Portfolio Analysis:

Performance Metrics:
- Total Return: +31.95%
- Concentration: High (top 2 = 85%)

Volatility: HIGH
- 48% crypto = elevated portfolio volatility
- Estimated vol: 40-50% annualized
- Sharpe ratio: ~0.8

Correlation Risk:
- BTC-ETH correlation: 0.9 (cluster risk)
- Tech correlation: 0.8 (sector concentration)

Recommendation: Add uncorrelated assets (correlation < 0.3)"
```

**Status:** ⬜ | ✅ | ❌

---

### AI-006: Tech / Disruptive Advisor ⬜

**Setup:**
1. Select **Tech / Disruptive** style

**Expected Characteristics:**

**Should INCLUDE:**
- ✅ "Zero to one" language
- ✅ "Power law" distribution mentions
- ✅ Network effects discussion
- ✅ TAM expansion thinking
- ✅ Exponential vs linear growth
- ✅ Contrarian tech vision
- ✅ References to Thiel or Chamath

**Should CRITIQUE:**
- ✅ Overweight in mature tech (AAPL, GOOGL)
- ✅ Missing emerging tech exposure
- ✅ Need for asymmetric bets

**Status:** ⬜ | ✅ | ❌

---

### AI-007: Growth (GARP) Advisor ⬜

**Setup:**
1. Select **Growth (GARP)** style

**Expected Characteristics:**

**Should INCLUDE:**
- ✅ PEG ratio mentions
- ✅ "Growth at reasonable price" language
- ✅ P/E to growth comparisons
- ✅ Accessible, practical tone
- ✅ References to Peter Lynch
- ✅ "Ten-bagger" potential discussion

**Should ANALYZE:**
- ✅ PEG ratios for holdings (assume values if needed)
- ✅ Growth quality assessment
- ✅ Valuation discipline

**Status:** ⬜ | ✅ | ❌

---

### AI-008: Quick Action Buttons ⬜

**Objective:** All quick actions work

**Test All Three Buttons:**

**1. "Analyze Portfolio"**
- ✅ Adds message: "Please analyze my portfolio comprehensively."
- ✅ AI responds
- ✅ Response relevant to portfolio

**2. "Risk Assessment"**
- ✅ Adds message: "Assess the risk level of my portfolio."
- ✅ AI responds with risk analysis
- ✅ Mentions volatility, concentration, or diversification

**3. "Rebalancing Ideas"**
- ✅ Adds message: "Suggest rebalancing ideas for my portfolio."
- ✅ AI gives specific suggestions
- ✅ Mentions which assets to increase/decrease

**Pass Criteria:**
- ✅ All 3 buttons work
- ✅ Each triggers different question
- ✅ Responses are relevant

**Status:** ⬜ | ✅ | ❌

---

### AI-009: Chat Input/Output ⬜

**Objective:** Manual chat works correctly

**Test Custom Questions:**

**Test 9A: Simple Question**

**Input:** "What do you think about Bitcoin?"

**Expected:**
- ✅ User message appears (blue bubble, right side)
- ✅ Loading dots appear
- ✅ AI response appears (white bubble, left side)
- ✅ Response addresses Bitcoin specifically
- ✅ Response matches selected style's perspective

**Test 9B: Follow-up Question**

**Input:** "Why do you say that?"

**Expected:**
- ✅ AI understands context
- ✅ Refers back to previous response
- ✅ Coherent conversation flow

**Test 9C: Empty Input**

**Actions:**
1. Leave input empty
2. Click Send

**Expected:**
- ❌ Nothing happens OR
- ⚠️ Message saying "Please enter a question"

**Test 9D: Very Long Input**

**Input:** (Type 500+ words)

**Expected:**
- ✅ Accepts long input
- ✅ AI responds appropriately
- ✅ No truncation errors

**Status:** ⬜ | ✅ | ❌

---

### AI-010: Portfolio Context ⬜

**Objective:** AI receives and uses portfolio data

**Setup:**
1. Ensure specific portfolio in tracker
2. Select any advisor style

**Test:**

**Ask:** "What is my largest holding?"

**Expected Response:**
- ✅ Correctly identifies largest holding
- ✅ Names specific ticker (e.g., "BTC" or "AAPL")
- ✅ May include percentage or value

**Ask:** "How much Bitcoin do I have?"

**Expected:**
- ✅ States BTC amount or percentage
- ✅ Numbers match Portfolio Tracker

**Ask:** "What is my total portfolio value?"

**Expected:**
- ✅ States correct total value
- ✅ Matches Portfolio Tracker total

**Pass Criteria:**
- ✅ AI has access to portfolio data
- ✅ Numbers are accurate
- ✅ Responds to specific holdings queries

**Status:** ⬜ | ✅ | ❌

---

### AI-011: Real API Toggle ⬜

**Objective:** Settings toggle between real and mock API

**Test 11A: Check Current Mode**

**Actions:**
1. Open Console (Cmd+Option+I)
2. Go to AI Advisor
3. Send a message
4. Look in Console

**Expected in Console:**
```
🔍 API Mode: REAL API  or  🔍 API Mode: MOCK
```

**Actual:** API Mode = _________________

---

**Test 11B: Toggle in Settings**

**Actions:**
1. Click ⚙️ Settings
2. Find "Use Real AI Responses" toggle
3. Note current state
4. Toggle it
5. Close settings
6. Send message in AI Advisor
7. Check Console

**Expected:**
- ✅ Toggle switches between Real/Mock
- ✅ Console shows new mode
- ✅ Setting persists after page refresh

**Test Both Modes:**

**Mock Mode:**
- ✅ Responses appear quickly (~1-2 seconds)
- ✅ Responses are pre-defined examples
- ✅ Console shows: "📝 Using mock response"

**Real Mode (if API key configured):**
- ✅ Responses take longer (5-15 seconds)
- ✅ Responses are unique to your query
- ✅ Console shows: "🤖 Calling Claude API via Vercel backend..."
- ✅ Console shows: "✅ Claude API response received"

**Status:** ⬜ | ✅ | ❌

---

### AI-012: Mock vs Real Response Quality ⬜

**Objective:** Compare mock and real responses

**Setup:**
1. Same portfolio
2. Same style (Value)
3. Same question: "Analyze my portfolio"

**Test in MOCK mode:**

**Response characteristics:**
```
Speed: _____ seconds
Length: _____ words
Specific to my portfolio: YES / NO
Generic feel: YES / NO
Quality (1-10): _____
```

**Test in REAL mode (if available):**

**Response characteristics:**
```
Speed: _____ seconds
Length: _____ words
Specific to my portfolio: YES / NO
Personalized: YES / NO
Quality (1-10): _____
```

**Comparison:**
```
Real more specific: YES / NO
Real better quality: YES / NO
Real worth the wait: YES / NO
```

**Status:** ⬜ | ✅ | ❌

---

### AI-013: Style Switching Mid-Conversation ⬜

**Objective:** Can switch styles during conversation

**Actions:**
1. Start with Value style
2. Ask: "What do you think of my portfolio?"
3. Get response
4. Switch to Tech style (click card)
5. Ask same question again

**Expected Behavior:**
- ✅ Style switches immediately
- ✅ Chat CLEARS or shows clear new conversation
- ✅ Welcome message changes
- ✅ New response reflects new style
- ✅ No mixing of previous style's advice

**Actual:**
```
Style switches: YES / NO
Chat clears: YES / NO
New style reflected: YES / NO
No confusion: YES / NO
```

**Status:** ⬜ | ✅ | ❌

---

### AI-014: Loading States ⬜

**Objective:** Loading indicators work correctly

**Actions:**
1. Send a message
2. Observe UI during processing

**Expected During Loading:**
- ✅ User message appears immediately
- ✅ Loading indicator appears (three dots animation)
- ✅ Avatar shows correct style icon
- ✅ Loading message at bottom of chat

**After Response:**
- ✅ Loading indicator disappears
- ✅ AI response appears
- ✅ Chat scrolls to bottom automatically
- ✅ Input field re-enabled

**Edge Case: Multiple Rapid Messages**

**Actions:**
1. Type and send message
2. Immediately send another before first responds

**Expected:**
- ⚠️ Alert: "Please wait for current response"
- ❌ Second message NOT sent
- ✅ First response completes normally

**Status:** ⬜ | ✅ | ❌

---

### AI-015: Error Handling ⬜

**Objective:** Graceful error handling

**Test 15A: Network Error Simulation**

**Setup:**
1. Real API mode ON
2. Disconnect internet (turn off WiFi)

**Actions:**
1. Send message

**Expected:**
- ⚠️ Error message appears
- ✅ Falls back to mock response OR shows clear error
- ✅ No crash or blank screen
- ✅ Can recover after reconnecting

---

**Test 15B: Invalid API Key (if testing backend)**

**Expected:**
- ⚠️ Clear error message
- ✅ Suggests checking settings
- ✅ Fallback to mock works

---

**Test 15C: Very Long Wait**

**Actions:**
1. Send message
2. If response takes >30 seconds

**Expected:**
- ⚠️ Timeout message or indicator
- ✅ Doesn't hang forever
- ✅ User can retry

**Status:** ⬜ | ✅ | ❌

---

## ADDITIONAL TESTS

### AI-016: Mobile Responsiveness ⬜

**Actions:**
1. Resize browser to mobile width (375px)
2. Test all functionality

**Expected:**
- ✅ Style cards stack vertically
- ✅ Chat bubbles readable
- ✅ Input field usable
- ✅ Quick actions stack or scroll

**Status:** ⬜ | ✅ | ❌

---

### AI-017: Long Conversation ⬜

**Actions:**
1. Have 10+ message exchange

**Expected:**
- ✅ All messages visible (scrollable)
- ✅ Auto-scroll to latest
- ✅ No performance degradation
- ✅ No message limit

**Status:** ⬜ | ✅ | ❌

---

### AI-018: Special Characters ⬜

**Test messages with:**
- Emojis: 🚀💰📈
- Symbols: $, €, %, @
- Code: `const x = 5;`

**Expected:**
- ✅ All render correctly
- ✅ No encoding issues

**Status:** ⬜ | ✅ | ❌

---

## SUMMARY

**Total Tests:** 18

**Completion:**
- ✅ Passed: _____
- ❌ Failed: _____
- ⬜ Not Run: _____

**Critical Issues:** _____

**Notes:**
_________________________________________________
_________________________________________________

---

**Tester:** Javier Valdepérez  
**Date:** _____________  
**Duration:** _____ hours