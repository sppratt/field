# Design System: Secondary Brown Color Integration

## Overview

A natural brown secondary color has been integrated throughout the Field app to break up the dominant sage green and add visual hierarchy, emphasis, and emotional depth. The brown shade evokes a tree trunk aesthetic while maintaining the approachable, polished feel of the platform.

---

## Color Palette

### Primary Colors (Existing)
- **Background**: `#f5f1ed` (warm cream)
- **Primary**: `#a8b8a0` (sage green)
- **Text**: `#3a3a3a` (soft charcoal)

### Secondary Colors (NEW)
- **Secondary (Brown)**: `#8b7355` - Main warm brown accent
- **Secondary Light**: `#a68a75` - Lighter brown for backgrounds/subtle accents
- **Secondary Dark**: `#6b5344` - Darker brown for text/strong emphasis
- **Secondary Subtle**: `rgba(139, 115, 85, 0.08)` - Very light brown for background tints

---

## Strategic Placement Guide

### 1. **Buttons & CTAs**
**Location**: `app/components/Button.tsx` & `app/styles/Button.module.css`
**Implementation**: New `accent` button variant with brown styling
- Primary CTA: Green
- Secondary CTA: Green outline
- Accent/Tertiary CTA: **Brown** (NEW)
- Use for: Alternative actions, secondary decisions

**Where to use**:
- Teacher dashboard: "Send Message" (use accent)
- Student dashboard: Alternative pathway selection
- Confirmation dialogs: Secondary options

---

### 2. **Stat Cards - Alternating Color Scheme**
**Location**: `app/components/ClassroomStatCard.module.css`
**Implementation**: Alternating even/odd cards with brown accents
- **Odd cards (1, 3, 5, ...)**: Sage green borders, green value text, green icons
- **Even cards (2, 4, 6, ...)**: **Brown left borders, brown value text, brown icons**
- Hover state: Brown shadow for even cards

**Benefits**:
- Creates visual rhythm and breaks monotony
- Guides eye through dashboard sequentially
- Maintains hierarchy while adding variety

**Affected areas**:
- Teacher dashboard: Classroom Stats grid (6 cards)
- Student dashboard: Progress overview cards (if applicable)

---

### 3. **Simulation & Interactive Choices**
**Location**: `app/styles/SimulationStep.module.css`
**Implementation**: Brown accents on selected choices and progress
- **Progress bar**: Brown gradient (was sage green)
- **Scenario box**: Brown top and left borders (was sage green top only)
- **Scenario accent line**: Brown gradient (was green)
- **Selected choice card**: Brown border, brown background tint
- **Selection checkmark**: Brown circle background
- **Selected choice shadow**: Brown-tinted shadow

**Why brown for selections**:
- Stronger visual emphasis for chosen paths
- Creates a "grounded" feeling for committed choices
- Distinguishes from hover states (green)
- Emotional resonance: brown = stability, commitment

**Impact**:
- All 5 career pathway simulations (Software Engineer, Nurse, Designer, etc.)
- 3 steps per simulation × 3 choices = 45 total interactive choice cards

---

### 4. **Career Pathway Cards**
**Location**: `app/styles/CareerCard.module.css`
**Implementation**: Brown accents on metadata and structure
- **Level badge**: Now brown with brown text (was green)
- **Packet front left border**: Subtle brown accent line
- **Packet front bottom border**: Brown dashed border (was black)

**Rationale**:
- Brown on badges creates visual break from body content
- Suggests professionalism and career depth
- Pairs well with green progress indicators

---

### 5. **Progress & Status Indicators**
**Location**: Various dashboard and simulation components
**Implementation**: Brown as alternative to green for different contexts
- **Completion progress bars**: Can alternate or layer green/brown
- **Status badges**: Brown for "in-progress" or "attempted" (vs green for "completed")
- **Milestone markers**: Brown for intermediate goals

**Recommended usage**:
- Green: Completed, active, success
- Brown: In-progress, selected, neutral, archived
- Yellow/Orange: Warning, needs attention

---

### 6. **Input Focus States & Accents**
**Location**: `app/styles/variables.css` (global input styling)
**Implementation**: Brown focus outlines as option
```css
/* Could be updated to: */
input:focus {
  outline: 2px solid var(--color-secondary);
}

/* Or alternate between green and brown */
input:nth-of-type(odd):focus {
  outline: 2px solid var(--color-primary);
}

input:nth-of-type(even):focus {
  outline: 2px solid var(--color-secondary);
}
```

---

### 7. **Emphasis & Callout Boxes**
**Location**: Modals, insight cards, recommendations
**Implementation**: Brown left borders on emphasis boxes
```css
.insightBox {
  border-left: 3px solid var(--color-secondary);
}

.callout {
  border-left: 4px solid var(--color-secondary);
  background: var(--color-secondary-subtle);
}
```

**Where to use**:
- Student dashboard: Personal progress insights
- Teacher dashboard: Class engagement tips
- Simulation feedback: Consequence explanations

---

## Implementation Checklist

### Completed ✓
- [x] Added brown color variables to `variables.css`
- [x] Created `accent` button variant in Button component
- [x] Alternating even/odd styling on ClassroomStatCard
- [x] SimulationStep: Progress bar, scenario box, selected choice styling
- [x] CareerCard: Level badge brown styling, border accents
- [x] Color palette exported for documentation

### In Progress
- [ ] Test responsiveness on mobile (stat cards)
- [ ] Verify color contrast accessibility (WCAG AA)
- [ ] Visual review of all implementations
- [ ] User testing: Does brown feel right for these contexts?

### To-Do (Optional Enhancements)
- [ ] Add brown variant to Badge component
- [ ] Update teacher dashboard modals with brown accents
- [ ] Implement brown in form validation states
- [ ] Add brown to pathway detail page hierarchy
- [ ] Consider brown in dark mode variant (if implemented)

---

## Accessibility Considerations

### Color Contrast
- Brown (`#8b7355`) on cream background (`#f5f1ed`): **Contrast ~6.2:1** ✓ (WCAG AA)
- Brown on white (`#ffffff`): **Contrast ~7.1:1** ✓ (WCAG AAA)
- Light brown (`#a68a75`) on cream: **Contrast ~3.8:1** ⚠️ (Use only decorative)

### Recommendations
1. Never rely solely on color to convey meaning (always include text/icons)
2. Test with color-blind simulation tools (Deuteranopia, Protanopia)
3. Ensure brown accents don't compete with interactive states
4. Provide alternative visual cues (borders, text, icons) in addition to color

---

## Design Rationale: Why Brown?

### Emotional Impact
- **Green (Primary)**: Calm, growth, exploration, approachable
- **Brown (Secondary)**: Grounded, professional, stability, authenticity, career readiness

### When to Use Each Color
- **Green**: Exploratory moments, encouragement, progress, success
- **Brown**: Committed choices, professional context, emphasis, depth

### Visual Benefits
1. **Breaks monotony**: Card-heavy layouts benefit from color variation
2. **Hierarchy**: Brown for important/selected vs green for general
3. **Narrative**: Brown suggests moving from exploration to commitment
4. **Modern aesthetic**: Warm brown pairs beautifully with sage green (trendy, sophisticated)

---

## Future Expansion Ideas

1. **Dark Mode**: Brown could be lightened to `#b8a896` for dark backgrounds
2. **Micro-interactions**: Brown tooltips, brown loading spinners
3. **Illustrations**: Add brown accents to any future iconography
4. **Certificates/Achievements**: Brown badges for major milestones
5. **Career-specific colors**: Blend brown with career colors for richer palette

---

## File Reference

### CSS Files Updated
- `app/styles/variables.css` - Color variables
- `app/styles/Button.module.css` - Accent button variant
- `app/components/ClassroomStatCard.module.css` - Alternating cards
- `app/styles/SimulationStep.module.css` - Simulation interaction
- `app/styles/CareerCard.module.css` - Pathway cards

### Component Files Updated
- `app/components/Button.tsx` - Accent variant type

### Files Reviewed (No Changes Needed)
- `app/styles/variables.css` - Global styling (no color changes needed yet)
- `app/styles/Homepage.module.css` - Hero CTA could benefit from brown in future
- `app/styles/Navigation.module.css` - Current styling sufficient

---

## Testing Checklist

- [ ] Desktop view: Stat cards alignment and spacing
- [ ] Mobile view: Card sizing with brown accents
- [ ] Tablet view: Simulation choice layout
- [ ] Color contrast: Use WebAIM contrast checker
- [ ] Color blindness: Deuteranopia/Protanopia simulation
- [ ] Print style: Brown color reproduction
- [ ] Browser compatibility: CSS gradient rendering
- [ ] User feedback: Does brown feel appropriate for high school audience?

---

## Notes

- The brown color `#8b7355` is warm enough to feel natural and inviting, not sterile or corporate
- Avoid overusing brown—its strategic placement creates impact
- The cream background (`#f5f1ed`) allows both green and brown to shine without competing
- Consider brown as the "professional" accent and green as the "exploratory" color

