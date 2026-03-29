# Quick Start - Get Field Running

## 5-Minute Setup

### Step 1: Create Supabase Account & Project (2 min)
```
1. Go to https://supabase.com
2. Sign up with email
3. Create new project
4. Wait for it to initialize
```

### Step 2: Get Your Credentials (1 min)
```
1. Go to Project Settings → API
2. Copy:
   - Project URL (looks like: https://xxxxx.supabase.co)
   - anon/public key (long string starting with eyJ...)
   - service_role key (long string starting with eyJ...)
```

### Step 3: Update .env.local (1 min)
```bash
# Open .env.local in project root
# Replace with your actual values:

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 4: Create Database Tables (1 min)
```
1. In Supabase Dashboard → SQL Editor
2. Paste the SQL from SUPABASE_SETUP.md
3. Click "Run"
4. Wait for success (tables + policies created)
```

### Step 5: Test It!
```bash
npm run dev
# Visit http://localhost:3000
# Click "Sign Up" → create an account
# You'll be logged in and see your dashboard!
```

## What You Can Now Do

✅ **Sign up** with email and password
✅ **Log in** to existing account
✅ **See student progress** on dashboard
✅ **Browse career pathways** (public)
✅ **Log out** securely

## Next Steps

### To add simulation:
1. Create simulation component
2. Embed in `/app/pathways/[id]/page.tsx`
3. Call `/api/progress` to track decisions
4. Dashboard automatically shows progress

### Example simulation call:
```typescript
const response = await fetch('/api/progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pathwayId: 'software-engineer',
    step: 2,
    decisions: { decision1: 'choiceA' },
    completionPercentage: 50,
  }),
});

const { progress } = await response.json();
console.log('Progress updated:', progress);
```

## Troubleshooting

### Error: "Missing Supabase URL"
→ Check `.env.local` has correct values with no typos

### Can't sign up
→ Make sure password is 8+ characters, email is valid

### Dashboard is blank
→ Check browser console for errors, verify you're logged in

### Still stuck?
→ See IMPLEMENTATION_GUIDE.md for detailed instructions

## Files Reference

- **SUPABASE_SETUP.md** – Detailed database setup guide
- **IMPLEMENTATION_GUIDE.md** – Complete technical guide
- **ARCHITECTURE_SUMMARY.md** – System architecture overview
- **CLAUDE.md** – Project vision and guidelines

---

**Ready to go!** Follow steps 1-5 above, then you have a fully authenticated platform to build simulations on top of.
