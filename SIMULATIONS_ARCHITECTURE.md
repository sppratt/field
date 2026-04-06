# Simulations Architecture & Design Guide

## Overview

Field's simulation system is built on a two-phase architecture:

1. **Phase 1 (Current - MVP):** TypeScript data structures in `/app/data/` for fast, read-only career and simulation content
2. **Phase 2 (Future):** Supabase database tables for dynamic, user-editable, and analytics-enabled content

This document describes both phases, the design decisions, and the migration path.

---

## Phase 1: TypeScript Data Files (MVP)

### Purpose

Quick, client-side data loading without database overhead. Perfect for MVP when content is static and read-only.

### Files

**`/app/data/careers.ts`**
- Extended `Career` interface with full career details
- 5 career objects (Software Engineer, Nurse, Graphic Designer, Data Analyst, Architect)
- Each career includes: level, overview, keySkills, typicalTasks, educationPath, salaryOutlook, recommendationTags

**`/app/data/simulations.ts`**
- TypeScript interfaces: `Simulation`, `SimulationStep`, `SimulationChoice`
- 5 complete simulation objects indexed by career pathway ID
- Each simulation includes: pathwayId, title, intro, steps array, outcomeSummary, estimatedTime
- Each step has: id, stepNumber, scenario, question, choices array
- Each choice has: id, text, feedback, tagEffects (optional), nextStep (nullable)

### Data Structure: Recommendation Tags

**Tag System:**
- `analytical` - Data-driven, logical thinking
- `creative` - Visual/innovative thinking
- `hands_on` - Practical, physical interaction
- `social` - Collaboration, communication
- `problem_solving` - Systems thinking, troubleshooting

**Tag Effects:**
Each choice awards 0-3 points toward one or more tags:
```typescript
tagEffects: {
  analytical: 2,
  problem_solving: 1,
  social: 0 // omit if not affecting
}
```

**Accumulation:**
As students complete simulations, tag scores are aggregated and stored in `student_progress.decisions_made.tagScores`.

### Example Simulation Structure

**Software Engineer (Complete)**
- Intro: "You're starting your first day as a junior software engineer at a tech startup..."
- Step 1: Code review decision (3 choices with tag effects)
- Step 2: Feature priority conflict (3 choices with tag effects)
- Step 3: Debugging approach (3 choices with tag effects)
- Outcome: Reflection on what being a software engineer means

**Other Careers (Structurally Complete)**
- Nurse: Medical ICU scenario
- Graphic Designer: Design sprint with client
- Data Analyst: Data interpretation challenge
- Architect: Community center design project

All simulations follow the same 3-step structure with 3 choices per step.

---

## Phase 2: Supabase Schema (Future Migration)

### Purpose

When Field needs to support:
- Dynamic content updates via admin UI
- User-generated simulations
- A/B testing variants
- Detailed analytics per choice
- Content versioning

### Schema Overview

**Four Core Tables:**

1. **`pathways`** - Career details
   - Columns: id, title, level, overview, key_skills (array), typical_tasks (array), education_path, salary_entry_level, salary_experienced, salary_outlook, recommendation_tags (array), created_at, updated_at
   - Relationships: One-to-many with simulations

2. **`simulations`** - Simulation metadata
   - Columns: id, pathway_id (FK), title, intro, outcome_summary, estimated_time_minutes, created_at, updated_at
   - Relationships: One-to-many with simulation_steps

3. **`simulation_steps`** - Decision steps
   - Columns: id, simulation_id (FK), step_number, scenario, question, created_at, updated_at
   - Relationships: One-to-many with simulation_choices

4. **`simulation_choices`** - Choice options with feedback and tag effects
   - Columns: id, step_id (FK), text, feedback, tag_effects (JSONB), next_step (nullable integer), created_at, updated_at
   - Relationships: Many-to-one with simulation_steps

### Security Model

**Row-Level Security (RLS):**
- All tables default to public read-only access (students can view all content)
- Admin write/update/delete requires `auth.jwt() ->> 'role' = 'admin'`
- Can be extended to support teacher-created simulations with role-based access

### SQL Migration File

Located at: `/lib/db/migrations/002-pathways-schema.sql`

Status: **Reference only** — not automatically applied. Run manually via Supabase SQL editor when ready to migrate.

---

## Integration Points

### Career Detail Page (`/app/pathways/[id]/page.tsx`)

**Current Behavior:**
- Fetches career data from TypeScript `careers.ts`
- Displays full career information (overview, skills, tasks, education, salary, tags)
- Loads simulation from TypeScript `simulations.ts`
- Renders simulation UI component

**Future Behavior (Phase 2):**
- Fetch career data from Supabase `pathways` table
- Fetch simulation data from Supabase `simulations` + `simulation_steps` + `simulation_choices` tables
- Add caching/pagination for better performance with large datasets

### Simulation Progress Tracking

**Storage Location:**
`student_progress.decisions_made` (JSONB field in Supabase `student_progress` table)

**Structure After Each Simulation:**
```json
{
  "steps_taken": 3,
  "current_step": 3,
  "choices": {
    "step_1": { "choiceId": "choice-1b", "tagEffects": { "analytical": 2, "problem_solving": 1 } },
    "step_2": { "choiceId": "choice-2a", "tagEffects": { "hands_on": 2 } },
    "step_3": { "choiceId": "choice-3c", "tagEffects": { "social": 2, "problem_solving": 1 } }
  },
  "tagScores": {
    "analytical": 2,
    "creative": 0,
    "hands_on": 2,
    "social": 2,
    "problem_solving": 2
  }
}
```

**Completion Tracking:**
- `completion_percentage = (current_step / total_steps) * 100`
- After final step: `status → 'completed'`, `completion_percentage → 100`

### Student Dashboard (`/app/(authenticated)/student/dashboard/page.tsx`)

**Display Elements:**
- Career progress cards showing completion percentage
- Tag breakdown per simulation (e.g., "Analytical: 5 pts")
- Accumulated tag scores across all simulations
- Recommendation insights (future feature)

**Future Enhancement:**
- Use accumulated tag scores to power a recommendation engine
- Show "You scored highest in: problem_solving and social skills"
- Suggest related careers based on tag profile

---

## Migration Path: TypeScript → Supabase

### When Ready to Migrate

**Prerequisites:**
1. Admin dashboard for content management built
2. Schema tested in staging environment
3. Seed data migration script prepared

### Migration Steps

1. **Create Supabase tables** (run `/lib/db/migrations/002-pathways-schema.sql`)

2. **Seed database** with current TypeScript data:
   ```typescript
   // Example migration script (pseudo-code)
   import { careers } from '@/app/data/careers';
   import { simulations } from '@/app/data/simulations';
   
   export async function seedPathwaysFromTypescript(supabase) {
     for (const career of careers) {
       await supabase.from('pathways').insert(career);
     }
     
     for (const [pathwayId, sim] of Object.entries(simulations)) {
       const simRecord = await supabase.from('simulations').insert({
         pathway_id: pathwayId,
         title: sim.title,
         intro: sim.intro,
         outcome_summary: sim.outcomeSummary,
         estimated_time_minutes: sim.estimatedTime
       });
       
       for (const step of sim.steps) {
         const stepRecord = await supabase.from('simulation_steps').insert({...});
         
         for (const choice of step.choices) {
           await supabase.from('simulation_choices').insert({...});
         }
       }
     }
   }
   ```

3. **Update queries** in components to fetch from Supabase:
   ```typescript
   // Before (TypeScript)
   import { careers } from '@/app/data/careers';
   const career = careers.find(c => c.id === id);
   
   // After (Supabase)
   const { data: career } = await supabase
     .from('pathways')
     .select('*')
     .eq('id', id)
     .single();
   ```

4. **Add admin dashboard** for content management (create, update, delete careers/simulations)

5. **Enable analytics** to track which choices students choose most frequently

### Backwards Compatibility

No migration needed for student progress data — the `decisions_made` JSONB structure remains the same.

---

## Design Decisions & Rationale

### Why Two Phases?

**MVP Benefits:**
- No database overhead for read-only content
- Faster initial launch
- Content versioned with code (git history)
- Easy to test without database infrastructure

**Phase 2 Benefits:**
- Dynamic content updates without redeployment
- Admin UI for non-technical content creators
- User-generated simulations support
- Analytics and A/B testing
- Scalability for hundreds of simulations

### Why JSONB for Tag Effects?

- Flexible: New tags can be added without schema changes
- Queryable: Supabase supports JSONB filtering
- Self-documenting: The choice itself documents tag effects
- Aggregatable: Can sum across multiple choices

### Why Store Progress in Decisions_Made?

- Single, atomic record per simulation completion
- Preserves full decision path for future analysis
- Supports replaying the simulation with user choices
- Aggregated tag scores derived from choices (can be computed on-the-fly or cached)

---

## Verification Checklist (After Implementation)

- [ ] Career detail pages display full career information
- [ ] All 5 careers have consistent data structure
- [ ] Career level field present and used for filtering
- [ ] "Start Simulation" button visible with simulation intro
- [ ] All 3 decision steps render with choices and feedback
- [ ] Choices display feedback text immediately after selection
- [ ] Tag effects from each choice are applied correctly
- [ ] After final step, outcome summary displays
- [ ] `student_progress.decisions_made` contains choice IDs and tag scores
- [ ] Completion percentage increases by ~33% per step (0% → 33% → 66% → 100%)
- [ ] Student dashboard shows tag breakdown after simulation
- [ ] All 5 simulations have complete 3-step structure
- [ ] Recommendation tag system ready for recommendation engine

---

## Future Enhancements

1. **Recommendation Engine**
   - Aggregate tag scores across simulations
   - Match students to careers based on tag profile
   - "Your career matches: You're very analytical and problem-solving focused"

2. **A/B Testing**
   - Create simulation variants
   - Track which choice options convert better
   - Optimize for engagement

3. **Analytics Dashboard**
   - Most common choices per step
   - Average tag scores by career
   - Time to completion

4. **User-Generated Simulations**
   - Allow teachers to create custom simulations
   - Share simulations across classrooms
   - Community-contributed content

5. **Adaptive Simulations**
   - Tailor branching based on student performance
   - Recommend next simulation based on tag profile
   - Progressive difficulty levels

---

## Related Files

- `/app/data/careers.ts` — Career definitions
- `/app/data/simulations.ts` — Simulation scenarios
- `/app/components/PathwayDetailClient.tsx` — Simulation UI rendering
- `/app/(authenticated)/student/dashboard/page.tsx` — Progress display
- `/lib/db/migrations/002-pathways-schema.sql` — Future Supabase schema
- `/CLAUDE.md` — Project overview and guidelines
