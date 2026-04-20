# Testing Guide: Multi-Level Adaptive Quiz System

## Quick Start

### 1. Setup

```bash
# Install dependencies
npm install

# Run database migration
# Connect to your Supabase project and run:
# lib/db/migrations/004-multi-level-system.sql

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

### 2. Create Test User

1. Sign up at http://localhost:3000/signup as a student
2. Complete sign-up flow
3. Verify email (check Supabase email logs if using test config)
4. Login

---

## Testing Workflow

### Test Path 1: Single Field Mastery (15 min)

**Objective:** Complete all 5 levels in one field

1. **Start Field**
   - Dashboard → "Start" on Software Engineer
   - ✓ Verify field appears in "Continue Your Journey"

2. **Level 1 - Below Threshold (70%)**
   - Click "Start Level 1"
   - Make deliberate wrong choices to score ~70%
   - ✓ Modal says "Keep Practicing! You need 75%"
   - ✓ Level 1 still available to retry

3. **Level 1 - Retry and Unlock (78%)**
   - Click "Try Again"
   - Make better choices
   - ✓ Modal shows "🎉 Level 1 Mastered!"
   - ✓ Level 2 unlocked

4. **Levels 2-5 - Fast Path**
   - For each level, complete with ~80% score
   - Each should unlock the next
   - ✓ After Level 5, field shows "Mastered" on dashboard

**Database Checks:**
```sql
-- Check field progress
SELECT * FROM student_field_progress 
WHERE user_id = '[your-user-id]' 
  AND field_id = 'software-engineer';
-- Expected: status='mastered', current_level=5, levels_completed=[1,2,3,4,5]

-- Check all attempts
SELECT level, attempt_number, score, unlocked_next_level 
FROM student_level_attempts 
WHERE user_id = '[your-user-id]' 
  AND field_id = 'software-engineer'
ORDER BY level, attempt_number;
-- Expected: 6 rows (L1 attempt 1 & 2, L2-L5 attempt 1 each)
```

---

### Test Path 2: Multi-Field Parallelism (20 min)

**Objective:** Work on 3 fields simultaneously

1. **Start 3 Fields**
   - Software Engineer: Complete L1 (≥75%)
   - Nurse: Complete L1 (≥75%)
   - Data Analyst: Start L1 (don't submit yet)

2. **Interleave Progress**
   - Dashboard → Nurse → Complete L2 (≥75%)
   - Dashboard → Software Engineer → Complete L2 (≥75%)
   - Dashboard → Data Analyst → Complete L1 (≥75%)

3. **Verify Independence**
   - Each field's progress is independent
   - Switching fields doesn't affect others
   - All three accessible from dashboard

**Database Checks:**
```sql
-- Check all three fields
SELECT field_id, status, current_level, levels_completed 
FROM student_field_progress 
WHERE user_id = '[your-user-id]'
ORDER BY field_id;

-- Expected: 3 rows
-- Software Engineer: status='in_progress', current_level=2, levels_completed=[1]
-- Nurse: status='in_progress', current_level=2, levels_completed=[1]
-- Data Analyst: status='in_progress', current_level=1, levels_completed=[1]
```

---

### Test Path 3: Analytics Verification (15 min)

**Objective:** Verify analytics calculations

1. **Generate Data**
   - Complete Software Engineer L1-L5 (selecting mostly analytical choices)
   - Complete Nurse L1-L3 (selecting mostly social choices)

2. **Check Top Skills**
   ```bash
   curl -H "Authorization: Bearer [your-token]" \
     http://localhost:3000/api/analytics/strengths
   ```
   - ✓ Response includes topSkills array
   - ✓ Analytical scores higher than social

3. **Check Decision Patterns**
   ```bash
   curl -H "Authorization: Bearer [your-token]" \
     http://localhost:3000/api/analytics/patterns?field_id=software-engineer
   ```
   - ✓ Analytical percentage is ~60%+
   - ✓ Other tags sum to remaining percentage

4. **Check Velocity**
   ```bash
   curl -H "Authorization: Bearer [your-token]" \
     http://localhost:3000/api/analytics/velocity?field_id=software-engineer
   ```
   - ✓ Shows days between level completions
   - ✓ All 4 transitions present (L1→L2, L2→L3, etc.)

---

### Test Path 4: Error Handling (10 min)

**Objective:** Verify system handles errors gracefully

1. **Test Lock Access**
   ```bash
   # Try to access Level 3 without completing Levels 1-2
   curl -H "Authorization: Bearer [your-token]" \
     http://localhost:3000/api/quiz/templates?field_id=nurse&level=3
   ```
   - ✓ Returns 403 Forbidden
   - ✓ Error message: "Level locked"

2. **Test Invalid Level**
   ```bash
   curl -H "Authorization: Bearer [your-token]" \
     http://localhost:3000/api/quiz/templates?field_id=nurse&level=6
   ```
   - ✓ Returns 404 Not Found

3. **Test Network Error**
   - Start quiz
   - Open DevTools Network tab
   - Throttle to "Offline"
   - Try to submit
   - ✓ Error message appears
   - Go back online
   - ✓ Retry button works

---

### Test Path 5: Mobile Responsiveness (10 min)

**Objective:** Verify mobile experience

1. **Chrome DevTools**
   - Press F12 → Toggle device toolbar (Ctrl+Shift+M)
   - Select "iPhone SE"

2. **Dashboard**
   - ✓ Stats display in single column
   - ✓ All sections readable
   - ✓ Buttons clickable

3. **Quiz Experience**
   - Start a level
   - ✓ Question and choices fit without scrolling
   - ✓ Progress bar visible
   - ✓ Submit button clickable

4. **Modal**
   - Complete a quiz
   - ✓ Unlock modal fits on screen
   - ✓ Text readable
   - ✓ Button clickable

---

## Debugging Tips

### Check Current User
```javascript
// In browser console
const { data } = await supabase.auth.getUser();
console.log(data.user.id);
```

### View API Response
1. Open DevTools Network tab
2. Filter by "fetch/XHR"
3. Click on request
4. View "Response" tab

### Check Database State
```sql
-- View specific user's progress
SELECT * FROM student_field_progress 
WHERE user_id = '[user-id]';

-- View all attempts
SELECT * FROM student_level_attempts 
WHERE user_id = '[user-id]'
ORDER BY field_id, level, completed_at;

-- View quiz template
SELECT * FROM quiz_templates 
WHERE field_id = 'software-engineer' 
  AND level = 1;
```

### Common Issues

**Issue:** Quiz template not found
- ✓ Check migration was applied
- ✓ Verify quiz templates are seeded in database
- ✓ Check field_id and level parameters are correct

**Issue:** Level won't unlock
- ✓ Check score calculation (need ≥75%)
- ✓ Verify choices have tagEffects
- ✓ Check `unlocked_next_level` flag in database

**Issue:** Analytics show no data
- ✓ Verify quiz attempts are recorded
- ✓ Check `decisions_made` field is populated
- ✓ Ensure tagScores are present in decisions

**Issue:** Mobile layout broken
- ✓ Check CSS media queries
- ✓ Verify button sizes (min 48px)
- ✓ Check container max-width

---

## Performance Testing

### Load Testing - Dashboard
```bash
# Using Apache Bench (ab)
ab -n 100 -c 10 http://localhost:3000/api/field-progress
```
- Target: <500ms median response time

### Load Testing - Quiz Submit
```bash
ab -n 100 -c 10 -p payload.json \
  -T application/json \
  http://localhost:3000/api/quiz/attempt
```
- Target: <1s median response time

### Profiling
1. DevTools → Performance tab
2. Start recording
3. Complete a full quiz experience
4. Stop recording
5. Look for:
   - No red frames
   - Consistent 60 FPS
   - <100ms main thread blocking

---

## Regression Testing

Run this checklist after any changes:

- [ ] Dashboard loads without errors
- [ ] Can start a field
- [ ] Level 1 quiz loads correctly
- [ ] Quiz submit calculates score
- [ ] Level unlock happens at 75%+
- [ ] Retry works and creates new attempt
- [ ] Multi-field switching maintains state
- [ ] Analytics endpoints return data
- [ ] Mobile view works
- [ ] Error states handled

---

## Sign-Off Criteria

✅ **Ready for Demo** when:
- All 15 E2E scenarios pass
- No console errors
- Mobile responsive works
- Analytics display correctly
- Performance acceptable
- Error handling graceful

✅ **Ready for Production** when:
- All above + regression tests pass
- Load testing shows acceptable performance
- Security review complete
- Analytics accuracy verified
- Documentation complete
