# End-to-End Test Scenarios: Multi-Level Adaptive Quiz System

## Prerequisites
- User is logged in and authenticated
- Database migrations have been run (004-multi-level-system.sql)
- Quiz templates are seeded in database
- API endpoints are deployed

---

## Scenario 1: Start a Field (Happy Path)

**Goal:** Verify student can start a new field

**Steps:**
1. Navigate to dashboard
2. Click "Start" on Software Engineer (not started field)
3. Verify `/api/field-progress` POST request succeeds
4. Confirm `student_field_progress` record created with:
   - `status: 'in_progress'`
   - `current_level: 1`
   - `levels_completed: []`
   - `started_at: <current timestamp>`

**Expected Result:** Field appears in "Continue Your Journey" section with Level 1 available

---

## Scenario 2: Complete Level 1 Below Threshold (70%)

**Goal:** Verify student can take quiz but doesn't unlock next level

**Setup:** Student has started Software Engineer field

**Steps:**
1. Click "Start" on Level 1 (Software Engineer)
2. Verify quiz loads from `/api/quiz/templates?field_id=software-engineer&level=1`
3. Complete all 6 quiz steps by selecting choices
4. For each step, verify choice buttons show feedback text
5. Click "Submit Quiz"
6. Verify POST `/api/quiz/attempt` request with:
   - `fieldId: 'software-engineer'`
   - `level: 1`
   - `choices: [{ step_id, choice_id, tagEffects }, ...]`

**Expected Result:**
- Score calculated: 70% (below 75% threshold)
- `LevelUnlockModal` shows: "Keep Practicing! You scored 70%. You need 75% to advance."
- Modal has "Try Again" button
- `student_level_attempts` record created with:
  - `unlocked_next_level: false`
  - `score: 70`
- `student_field_progress` unchanged (still at current_level: 1)
- Dashboard still shows Level 1 as available to retry

---

## Scenario 3: Retry Level 1 and Unlock (78%)

**Goal:** Verify retry mechanism and level unlock

**Setup:** Student has attempted Level 1 with 70% score

**Steps:**
1. On unlock modal, click "Try Again"
2. Complete Level 1 quiz again with better choices
3. Submit quiz
4. Score calculated: 78% (meets 75% threshold)

**Expected Result:**
- `LevelUnlockModal` shows: "🎉 Level 1 Mastered! You've successfully completed this level with a score of 78%"
- Modal displays: "✨ Level 2 is now unlocked!"
- Button text: "Start Level 2"
- `student_level_attempts` record created with:
  - `attempt_number: 2`
  - `unlocked_next_level: true`
  - `score: 78`
- `student_field_progress` updated:
  - `current_level: 2`
  - `levels_completed: [1]`
- Click "Start Level 2" navigates to Level 2 quiz

---

## Scenario 4: Complete Levels 2-5 in Sequence

**Goal:** Verify progressive level unlocking through field mastery

**Setup:** Student just unlocked Level 2 (Software Engineer)

**Steps:**
1. Complete Level 2 with 80% score → unlocks Level 3
2. Complete Level 3 with 76% score → unlocks Level 4
3. Complete Level 4 with 82% score → unlocks Level 5
4. Complete Level 5 with 79% score → field mastered

**Expected Result:**
- After Level 5 completion:
  - `student_field_progress` updated:
    - `status: 'mastered'`
    - `current_level: 5`
    - `levels_completed: [1, 2, 3, 4, 5]`
    - `completed_at: <timestamp>`
  - Dashboard shows field in "🌟 Mastered Fields" section
  - FieldLevelProgress displays all 5 levels as "✓ Mastered"

---

## Scenario 5: Multi-Field Parallelism

**Goal:** Verify student can work on multiple fields simultaneously

**Setup:** Student completed Software Engineer (all 5 levels)

**Steps:**
1. On dashboard, click "Start" on Nurse field
2. Verify Nurse appears in "Continue Your Journey" with Level 1
3. Complete Nurse L1 with 80% → unlocks L2
4. Navigate back to dashboard
5. Click "Continue" on Software Engineer (now mastered)
6. Verify Software Engineer shows as "Mastered" with all levels completed
7. Click "Continue" on Nurse L2
8. Complete Nurse L2 with 75% → unlocks L3
9. Navigate to Graphic Designer, start L1
10. Complete Graphic Designer L1 with 88% → unlocks L2

**Expected Result:**
- Dashboard shows in "Continue Your Journey":
  - Nurse (Level 2/5 in progress)
  - Graphic Designer (Level 1/5 in progress)
- Software Engineer appears in "🌟 Mastered Fields"
- Progress persists correctly:
  - Each field maintains independent progress
  - Switching fields doesn't affect others
  - All three fields accessible and trackable

---

## Scenario 6: Analytics - Velocity Calculation

**Goal:** Verify learning speed metrics

**Setup:** Student has completed:
- Software Engineer: All 5 levels over 10 days
- Nurse: Level 1-3 over 5 days

**Steps:**
1. Call `GET /api/analytics/velocity?field_id=software-engineer`
2. Verify response includes:
   - `level_1_to_2_days: ~2`
   - `level_2_to_3_days: ~2`
   - `level_3_to_4_days: ~3`
   - `level_4_to_5_days: ~3`
3. Call `GET /api/analytics/velocity?field_id=nurse`
4. Verify Nurse shows faster progression (~1.7 days per level)

**Expected Result:**
- Dashboard displays velocity insight showing Nurse has faster learning pace
- Visual indication: "You're 2x faster in Nurse compared to Software Engineer"

---

## Scenario 7: Analytics - Decision Patterns

**Goal:** Verify decision pattern analysis

**Setup:** Student has completed Software Engineer L1-L5

**Steps:**
1. Throughout all levels, student gravitates toward analytical and social choices
2. Call `GET /api/analytics/patterns?field_id=software-engineer`
3. Verify response shows aggregate percentages:
   - `analytical: 45%`
   - `social: 30%`
   - `creative: 10%`
   - `hands_on: 10%`
   - `problem_solving: 5%`

**Expected Result:**
- Dashboard insight displays: "You favor analytical decisions in software-engineer"
- Recommendation generated: "Consider roles emphasizing technical strategy and communication"

---

## Scenario 8: Analytics - Emerging Strengths

**Goal:** Verify trending skill identification

**Setup:** Student recently focused on Nurse and Data Analyst fields

**Steps:**
1. Call `GET /api/analytics/strengths`
2. System compares recent 2 weeks vs. older attempts
3. Verify response includes:
   - `topSkills`: sorted by total score
   - `emergingStrengths`: skills with significant upward trend
   - `insights`: summary statistics

**Expected Result:**
- If student is improving in "social" skills via Nurse field:
  - `emergingStrengths` shows: `{ tag: 'social', velocity: +15, trend: 'increasing' }`
- Dashboard displays: "📈 Trending Up: social" 
- Recommendation: "You're developing strong social skills. Consider exploring roles like Nurse or Architect that emphasize collaboration."

---

## Scenario 9: Lock Management - Access Control

**Goal:** Verify only unlocked levels are accessible

**Setup:** Student has completed Software Engineer L1 only

**Steps:**
1. Attempt to fetch `/api/quiz/templates?field_id=software-engineer&level=3`
2. Verify endpoint returns 403 Forbidden
3. Error message: "Level locked. Complete previous level first."
4. Verify only Levels 1 and 2 can be fetched

**Expected Result:**
- Student cannot access locked levels via API
- UI prevents navigation to locked levels
- Proper error handling in all attempts

---

## Scenario 10: Dashboard Stats Integration

**Goal:** Verify all stats display correctly on dashboard

**Setup:** Student has:
- Software Engineer: 5/5 mastered
- Nurse: 2/5 in progress
- Data Analyst: 0/5 not started

**Steps:**
1. Navigate to dashboard
2. Verify quick stats display:
   - "In Progress: 1"
   - "Mastered: 1"
   - "Levels Complete: 7" (5 + 2)
3. Verify sections appear:
   - ✅ "Continue Your Journey" with Nurse progress
   - ✅ "Your Insights" with top skills and trending
   - ✅ "🌟 Mastered Fields" with Software Engineer
   - ✅ "💡 Recommendation" suggesting Data Analyst or Graphic Designer

**Expected Result:**
- All stats accurate and responsive
- All sections properly populated
- Navigation works between sections and fields

---

## Scenario 11: Score Boundary Testing

**Goal:** Verify 75% threshold edge cases

**Test Cases:**
1. Score: 74.9% → Should NOT unlock (fails)
2. Score: 75.0% → Should unlock (passes)
3. Score: 75.1% → Should unlock (passes)

**Steps:**
1. Manipulate choice values to hit exact boundaries
2. Submit quizzes at each boundary
3. Verify unlock logic triggers correctly

**Expected Result:**
- Threshold works correctly at boundary
- Scores displayed to 1 decimal place
- Unlock behavior consistent

---

## Scenario 12: Mobile Responsiveness

**Goal:** Verify all components work on mobile (375px width)

**Steps:**
1. Use Chrome DevTools to emulate iPhone SE (375px)
2. Navigate through dashboard
3. Start a quiz on Level 1
4. Complete quiz and view results modal
5. View field progress cards
6. Test all buttons and interactions

**Expected Result:**
- Layout adapts gracefully
- All text readable
- Buttons clickable (48px min)
- No horizontal scrolling
- Progress bars visible
- All modals fit on screen

---

## Scenario 13: Error Handling

**Goal:** Verify graceful error handling

**Test Cases:**

### 13a: Network Error
1. Start quiz but disconnect network
2. Submit quiz
3. Verify error message displays
4. "Retry" button functional after reconnect

### 13b: Invalid Input
1. Try to POST quiz attempt with missing fieldId
2. Verify 400 Bad Request response
3. API rejects gracefully

### 13c: Unauthorized Access
1. Session expires mid-quiz
2. Attempt to submit
3. Verify 401 Unauthorized response
4. Redirect to login

**Expected Result:**
- All errors handled gracefully
- User-friendly error messages
- No blank screens or crashes
- Recovery paths available

---

## Scenario 14: Data Integrity - Concurrent Attempts

**Goal:** Verify no race conditions in level unlocks

**Setup:** Student at Level 1, ready to submit

**Steps:**
1. Open Level 1 quiz in two browser tabs simultaneously
2. Complete and submit both quizzes within 1 second
3. Both should succeed but second shouldn't create duplicate unlock

**Expected Result:**
- Two `student_level_attempts` records created
- `student_field_progress` updated only once
- `current_level: 2` (not duplicated)
- `levels_completed: [1]` (not [1, 1])

---

## Scenario 15: Performance - Load Times

**Goal:** Verify acceptable performance

**Metrics:**
- Dashboard load: < 2 seconds
- Quiz load: < 1 second
- Quiz submit: < 2 seconds
- Analytics queries: < 1 second

**Steps:**
1. Monitor network tab while loading dashboard
2. Monitor while loading quiz
3. Monitor while submitting quiz
4. Use lighthouse for performance audit

**Expected Result:**
- All metrics meet targets
- No slow queries
- Efficient API responses

---

## Test Execution Checklist

### Database Layer ✓
- [ ] Migration 004 applied successfully
- [ ] All tables created with correct schemas
- [ ] Indexes created for performance
- [ ] Data can be inserted and queried

### API Layer ✓
- [ ] All 6 endpoints return correct responses
- [ ] Authentication required and enforced
- [ ] Error handling returns proper status codes
- [ ] Data validation working

### UI Layer ✓
- [ ] All components render correctly
- [ ] State management working
- [ ] Form inputs functional
- [ ] Navigation between states smooth

### Integration ✓
- [ ] Database ↔ API ↔ UI data flow correct
- [ ] Progress persists across sessions
- [ ] Analytics accurate
- [ ] Multi-field independence maintained

### Edge Cases ✓
- [ ] Boundary conditions handled
- [ ] Concurrent operations safe
- [ ] Error recovery working
- [ ] Mobile responsive

---

## Known Issues / Notes

_To be filled during testing_

---

## Sign-Off

**Tested by:** [Name]
**Date:** [Date]
**Status:** [ ] Pass [ ] Fail (with issues listed)
