# Field Platform - Authentication & Database Implementation Guide

## Overview

You now have a complete authentication and database infrastructure built on Supabase. This guide explains how to set it up and use it.

## Architecture Summary

### What's Implemented

1. **Authentication System**
   - Email/password signup and login
   - User roles: `student` and `teacher`
   - Session management with Supabase Auth
   - Logout functionality
   - Protected routes for authenticated users

2. **Database Structure**
   - `users` table - stores user profile information
   - `student_progress` table - tracks pathway progress per user
   - Row-Level Security (RLS) - automatic data isolation per user

3. **Pages**
   - `/auth/signup` - Sign up page for new users
   - `/auth/login` - Log in page for existing users
   - `/student/dashboard` - Dashboard for student users
   - `/teacher/dashboard` - Dashboard for teacher users

4. **API Endpoints**
   - `POST /api/auth/logout` - Log out current user
   - `GET /api/progress?pathwayId=xyz` - Get progress for a pathway
   - `POST /api/progress` - Update progress on a pathway

5. **Navigation Updates**
   - Navigation bar now shows login/signup links when unauthenticated
   - Shows "Dashboard" and "Log Out" links when authenticated
   - Dynamically routes to correct dashboard based on user role

## Setup Instructions

### Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign up
2. Create a new project
3. Wait for it to initialize (takes ~2 minutes)
4. Go to Project Settings → API
5. Copy your:
   - Project URL
   - anon/public key
   - service_role key

### Step 2: Configure Environment Variables

1. Open `.env.local` in the project root (created for you)
2. Replace the placeholder values with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important:** Never commit the service role key to git. `.env.local` is already in `.gitignore`.

### Step 3: Create Database Tables

In the Supabase dashboard:

1. Go to SQL Editor
2. Copy and paste the SQL from `SUPABASE_SETUP.md`
3. Click "Run" to create all tables and policies

### Step 4: Configure Authentication Settings

In Supabase Dashboard → Authentication → URL Configuration:

1. Set Site URL to: `http://localhost:3000` (development)
2. Add Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/student/dashboard`
   - `http://localhost:3000/teacher/dashboard`

For production, update these with your deployed domain.

### Step 5: Test the Application

1. Run `npm run dev`
2. Visit http://localhost:3000
3. Click "Sign Up" to create a new account
4. Choose either "Student" or "Teacher" role
5. You'll be redirected to the appropriate dashboard

## How It Works

### Authentication Flow

```
User visits /auth/signup
    ↓
Enters email, password, name, role
    ↓
Click "Create Account"
    ↓
Supabase creates auth user + database user record
    ↓
User logged in automatically
    ↓
Redirect to /student/dashboard or /teacher/dashboard
```

### Protected Routes

Routes in `(authenticated)/` are automatically protected:
- If user is not logged in, they're redirected to `/auth/login`
- The `(authenticated)/layout.tsx` checks auth status before rendering

### Progress Tracking

When a student starts a pathway:

1. Dashboard shows pathway status: "Not Started" | "In Progress" | "Completed"
2. Clicking a pathway navigates to `/pathways/[id]`
3. From the simulation page, you can call the API to update progress:

```typescript
// Update progress
const response = await fetch('/api/progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pathwayId: 'software-engineer',
    step: 1,
    decisions: { choice1: 'optionA' },
    completionPercentage: 50,
  }),
});

const { progress } = await response.json();
```

## File Structure

```
app/
├── (public)/                    # Public routes (no auth required)
│   ├── page.tsx               # Homepage
│   ├── pathways/              # Career pathways pages
│   └── auth/
│       ├── signup/page.tsx
│       └── login/page.tsx
│
├── (authenticated)/           # Protected routes (auth required)
│   ├── layout.tsx            # Auth check wrapper
│   ├── student/dashboard/
│   └── teacher/dashboard/
│
├── api/
│   ├── auth/logout/
│   └── progress/              # Progress tracking endpoints
│
├── components/                # React components
├── styles/                    # CSS modules
├── data/                      # Static data (careers)
└── lib/
    ├── db/
    │   ├── types.ts          # TypeScript types
    │   ├── users.ts          # User queries
    │   └── progress.ts       # Progress queries
    ├── supabase/
    │   └── client.ts         # Supabase client
    └── utils/
        └── auth.ts           # Auth utilities
```

## Next Steps

### 1. Implement Simulation Flow

When user starts a pathway, integrate the simulation:

```typescript
// In pathway detail page
const handleStartSimulation = async () => {
  const response = await fetch('/api/progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pathwayId: pathwayId,
      action: 'start',
    }),
  });

  // Start simulation component...
};
```

### 2. Add More Progress Tracking

In the simulation, update progress as student makes decisions:

```typescript
// After each decision
const response = await fetch('/api/progress', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    pathwayId: pathwayId,
    step: currentStep,
    decisions: userChoices,
    completionPercentage: calculateCompletion(currentStep, totalSteps),
  }),
});
```

### 3. Teacher Features

The teacher dashboard is scaffolded but needs:

- Class creation and management
- Student enrollment
- Progress analytics and reporting
- Student feedback system

### 4. Extend Database

Future tables to add:

```sql
-- Teacher classes
CREATE TABLE teacher_classes (
  id UUID PRIMARY KEY,
  teacher_id UUID REFERENCES users(id),
  name TEXT,
  class_code TEXT UNIQUE
);

-- Class enrollments
CREATE TABLE class_enrollments (
  id UUID PRIMARY KEY,
  class_id UUID REFERENCES teacher_classes(id),
  student_id UUID REFERENCES users(id)
);
```

## Troubleshooting

### "Missing Supabase URL or Anon Key"

**Solution:** Make sure `.env.local` has the correct values:
- `NEXT_PUBLIC_SUPABASE_URL` (should start with https://)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (should be a long string)

### Auth not persisting after page refresh

**Solution:** This is expected if Supabase session cookies aren't configured. For production, ensure redirect URLs are set correctly in Supabase → Authentication → URL Configuration.

### Can't create account

**Solution:**
1. Check email format is valid
2. Password must be at least 8 characters
3. Check that users table and RLS policies were created (run SQL from SUPABASE_SETUP.md)

### Student/teacher dashboard is blank

**Solution:**
1. Make sure you're logged in
2. Check browser console for errors
3. Verify `.env.local` has correct Supabase URL

## Deployment Considerations

For production (e.g., Vercel):

1. Add environment variables in deployment platform
2. Update Supabase → Authentication → URL Configuration with production domain
3. Update redirect URLs to use production domain
4. Consider adding password reset flow
5. Add email verification (Supabase supports this)

## Security Notes

✅ Row-Level Security (RLS) ensures users can only access their own data
✅ Service role key is server-side only and never exposed to client
✅ Anon key is limited by RLS policies
✅ Passwords are hashed by Supabase Auth
✅ Sessions use secure cookies

⚠️ Future considerations:
- Rate limiting on auth endpoints
- Email verification for signups
- Password reset functionality
- Two-factor authentication (Supabase supports MFA)

## Support & Next Steps

The infrastructure is now in place. To add the simulation flow:

1. Create simulation component in `/app/components/Simulation.tsx`
2. Embed it in `/app/pathways/[id]/page.tsx`
3. Have simulation call progress API endpoints as user progresses
4. Dashboard will automatically show updated progress

Questions? Check:
- `SUPABASE_SETUP.md` for database setup details
- `lib/db/types.ts` for available data types
- `lib/db/progress.ts` for progress tracking functions
