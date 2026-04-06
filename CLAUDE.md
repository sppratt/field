# CLAUDE.md – Field Web Platform Development Guide

---

## Project Overview

Field is an interactive web platform that enables high school students to explore potential careers through engaging, decision-based simulations. Rather than providing static job descriptions, Field lets students “step into” careers and experience scenarios and choices similar to what professionals face on the job. The experience is designed to be approachable, exploratory, and modern.

---

## Product Goals

- **Engagement:** Make exploring careers fun, memorable, and interactive.
- **Exploration:** Empower students to try different career paths in a low-pressure environment.
- **Guidance:** Offer actionable feedback and help students see their own progress/growth.
- **Accessibility:** Ensure the platform is easy to use and credible for teenagers.
- **Credibility:** Present career information with polish and trustworthiness.

---

## Core Concept

Students browse a catalog of career pathways (e.g., software engineer, architect, nurse) and select one to explore. Each pathway includes:

- A short, accessible explanation of the profession.
- An interactive scenario-based simulation.
- Decision points with multiple choices that influence the scenario outcome.
- Feedback on decisions and progression through the scenario.
- An indicator or metaphor for showing progress (subtle growth, not plant-themed).

---

## Design Direction

- **Background:** Use a warm cream or off-white (avoid pure white).
- **Primary Color:** Muted sage green.
- **Text Color:** Soft charcoal or near-black (not pure black).
- **Style:** Clean, modern, and calm with generous whitespace.
- **Imagery:** Avoid plant/nature visuals, even with the name “Field.”
- **Metaphor:** Subtle growth to represent progress/exploration.
- **Feel:** Approachable for teens, highly polished, but NOT like homework or schoolwork.

---

## Target Users

- **Main Audience:** High school students (ages ~14–18) seeking to explore career options.
- **Secondary:** Teachers/counselors (reference only – design for students).

---

## Technical Stack

- **Framework:** Next.js (for routing, SSR, and React integration).
- **Frontend:** React.
- **Language:** TypeScript (strict typing for scalability/maintainability).
- **Styling:** Modular CSS or CSS-in-JS.
- **Responsiveness:** Fully responsive/mobile-friendly UI.
- **State Management:** React hooks/local state; avoid adding heavy libraries unless necessary.

---

## MVP Features

1. **Homepage**
   - Short introduction to Field and its value.
   - Inviting CTA to explore career pathways.

2. **Career Pathways List**
   - Catalog of available professions, each with a brief description.

3. **Individual Pathway Pages**
   - Overview of selected profession.
   - Embedded interactive simulation.

4. **Simulation System**
   - Decision points where students choose between options.
   - Branching scenarios with feedback.
   - Simple, stateless local persistence (no user authentication).

5. **Basic Progress Tracking**
   - Progress indicator or visual metaphor (growth, bar, etc.).

---

## Code Guidelines

- Use strict TypeScript everywhere.
- Structure code using reusable React components.
- Prefer clear naming and keep components modular/composable.
- Organize code into key folders: `components/`, `pages/`, `utils/`, `data/`, `styles/`, `public/`.
- Comment where logic or intent isn't obvious.
- Prioritize accessibility (semantics, ARIA, color contrast).
- Write CSS to match the described palette and allow responsive layouts.
- Avoid excessive dependencies; keep codebase lean.

---

## Development Approach

1. **Start with core layouts and navigation.**
2. **Implement main MVP flows in this order:**
   - Homepage → Pathways list → Individual pathway/simulation.
3. **Use static/mock data for simulations and pathways first.**
4. **Refactor UI into clear, reusable components.**
5. **Ensure all flows work on mobile and desktop.**
6. **Validate simulation logic and basic progress indicators.**
7. **Document new development workflow and architecture updates here.**

---

## UX Principles

- **Exploratory:** Encourage students to try different paths.
- **Encouraging:** Use positive, constructive feedback.
- **Clarity:** Make instructions and content easy to understand.
- **Progressive Disclosure:** Unfold info and options as needed.
- **Friendly Tone:** Welcoming, never formal/clinical.
- **Responsiveness:** Fully functional and pleasing on all screen sizes.
- **Direct Feedback:** Immediate responses after choices.
- **Polish:** Clean, modern, visually credible.

---

## AI Coding Agent: Ongoing File Maintenance

As you develop the project, **update this file** with the following (expand sections as work proceeds):

### 1. Development Commands

**Setup:**
- `npm install` – install project dependencies
- `npm run dev` – start development server (http://localhost:3000)

**Building & Deployment:**
- `npm run build` – build for production
- `npm start` – start production server

**Code Quality:**
- `npm run lint` – run ESLint to check code style

**Development Tips:**
- Use `npm run dev` during development with hot reload enabled
- TypeScript strict mode is enabled; ensure all types are correct
- ESLint runs automatically; fix issues before committing

---

### 2. Directory Structure & Module Organization

**Current Structure:**

```
/app
  /components
    Layout.tsx         # Main layout wrapper with nav/footer
    Navigation.tsx     # Navigation bar component
    Button.tsx         # Reusable button component
  /pathways
    page.tsx           # Career pathways list page
    /[id]
      page.tsx         # Individual pathway detail page
  /data
    careers.ts         # Mock career data (8 example careers)
  /styles
    variables.css      # Design system: colors, spacing, typography
    globals.css        # Global resets and base styles
    Layout.module.css  # Layout component styles
    Navigation.module.css
    Button.module.css
    Homepage.module.css
    PathwaysPage.module.css
  /utils
    cn.ts              # Class name utility for conditional styling
  /public              # Static assets (will add images/favicon as needed)
  layout.tsx           # Next.js root layout
  page.tsx             # Homepage

Root config files:
- package.json         # Dependencies and scripts
- tsconfig.json        # TypeScript configuration (strict mode)
- next.config.ts       # Next.js configuration
- .eslintrc.json       # ESLint configuration
- .gitignore           # Git ignore rules
```

**Key Design Decisions:**
- **CSS Modules** for scoped component styling + **CSS Variables** for design system
- **App Router** (Next.js 15) with file-based routing in `/app` directory
- **TypeScript strict mode** for type safety and maintainability
- **React hooks** for state management (no heavy libraries on MVP)

---

### 3. Architecture Decisions & Component Interaction

**Current MVP Architecture:**

1. **Layout System:**
   - `Layout.tsx` wraps all pages with navigation header and footer
   - `Navigation.tsx` provides persistent navigation with active link highlighting
   - Uses Next.js `usePathname()` hook for client-side route detection

2. **Data Flow:**
   - Career data stored in `careers.ts` as TypeScript-typed array
   - Routes use Next.js App Router file-based routing:
     - `/app/page.tsx` → homepage
     - `/app/pathways/page.tsx` → pathways list
     - `/app/pathways/[id]/page.tsx` → individual pathway (dynamic)
   - Individual pathway pages generated via `generateStaticParams()` for static optimization

3. **Styling System:**
   - **CSS Variables** in `variables.css` define entire design palette (colors, spacing, typography)
   - **CSS Modules** for component-scoped styles (no style pollution)
   - **Utility** `cn.ts` for conditional class name merging
   - Responsive design using mobile-first media queries

4. **Component Strategy:**
   - Reusable `Button` component supports multiple variants (primary/secondary), sizes, and href linking
   - `Button` supports accessibility with ARIA labels
   - Components are minimal and composable; new components added as simulation logic grows

5. **Future Simulation Logic:**
   - Simulation state will likely use React hooks (`useState`) for MVP
   - Decision branching stored as nested data structures in careers.ts or separate scenarios file
   - Progress tracking will use simple numeric or percentage state
   - No authentication needed for MVP (stateless exploration)

---

### 4. Configuration Files

- **package.json** – npm dependencies (react, next, typescript) and scripts (dev, build, lint)
- **tsconfig.json** – TypeScript strict mode enabled; path aliases configured (`@/*` → root)
- **next.config.ts** – Next.js configuration (React strict mode enabled)
- **.eslintrc.json** – ESLint config extending `next/core-web-vitals`
- **.gitignore** – Standard Node/Next.js ignores
- **CLAUDE.md** – This guidance file (keep updated as project evolves)

---

## Change Log

**2026-04-03 – Content/Data System & Simulations Implementation Complete**
- Extended Career interface with full professional details (overview, skills, tasks, education, salary, tags)
- Reduced careers from 8 to focused 5 (Software Engineer, Nurse, Graphic Designer, Data Analyst, Architect)
- Created simulations.ts with complete 3-step scenario data for all 5 careers
- Implemented recommendation tag system (analytical, creative, hands_on, social, problem_solving)
- Software Engineer simulation complete with 3 steps × 3 choices × tag effects per choice
- Other 4 simulations structurally complete with realistic career scenarios
- Created Supabase migration schema (002-pathways-schema.sql) for future database migration
- Created SIMULATIONS_ARCHITECTURE.md with comprehensive design documentation
- Updated PathwayDetailClient to display career information with full details
- Integrated interactive simulation UI with step progression and choice selection
- Implemented progress tracking with tag score accumulation
- Changed button text from "Start Growing" to "Start Simulation" for clarity
- All simulations ready to render with feedback and outcome summaries
- Database layer ready for dynamic content management when needed
- See SIMULATIONS_ARCHITECTURE.md for migration path and future enhancements

**2026-03-29 – Authentication & Database Infrastructure Complete**
- Integrated Supabase for email/password authentication
- Created user management system with role support (student/teacher)
- Built PostgreSQL database schema with Row-Level Security (RLS)
- Implemented student progress tracking data model
- Created signup and login pages with form validation
- Built student dashboard with progress overview
- Built teacher dashboard (scaffolded for classroom features)
- Added protected route system with auth middleware
- Created API endpoints for progress tracking
- Updated Navigation component with dynamic auth state
- Added 7 new library modules for database queries and auth utilities
- Complete infrastructure ready for simulation integration
- See ARCHITECTURE_SUMMARY.md and IMPLEMENTATION_GUIDE.md for details

**2026-03-25 – Project Scaffolding Complete**
- Initialized Next.js 15 project with TypeScript (strict mode) and ESLint
- Set up design system: CSS variables + CSS Modules for styling
- Created core components: Layout, Navigation, Button
- Built homepage with hero section and CTA
- Built career pathways list page with 8 mock careers
- Built pathway detail pages (placeholder for simulations)
- Established project structure following CLAUDE.md specs
- Ready for simulation logic and interactive features

---

**Important:**  
Always reference and update this file throughout development.  
Prioritize simplicity, clarity, and approachability for high school students.  
Avoid any plant/nature visuals even with the Field brand name.

---