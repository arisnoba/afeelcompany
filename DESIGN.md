# Design System Strategy: The Editorial Archive

## 1. Overview & Creative North Star

**Creative North Star: "The Digital Atelier"**
This design system moves away from the "app-like" density of traditional SaaS and embraces the spacious, authoritative layout of a high-end fashion periodical. We are not building a tool; we are curating an experience. The "Digital Atelier" ethos relies on intentional asymmetry, high-contrast typography scales, and a rejection of standard containerization. By utilizing generous whitespace and a rigid 0px corner radius, we evoke the feeling of a physical gallery or a bespoke press kit.

The layout should feel like a rhythmic composition of "objects" on a canvas rather than "widgets" in a grid. We lean into the tension between the razor-sharp edges of our UI and the fluid, organic nature of fashion photography.

## 2. Colors

The palette is a masterclass in tonal restraint. We prioritize a monotone foundation to allow imagery to remain the protagonist, using a deep, intellectual green as our single point of focus.

### The Palette

- **Monotone Core:** Utilizing `surface` (#fcf9f8) as our primary canvas and `primary` (#000000) for high-impact structural elements.
- **The Signature Accent:** `tertiary` (#274133) is our Deep Emerald. Use this sparingly for moments of prestige—call-to-actions, active states, or brand-defining flourishes.
- **The Neutral Bridge:** `secondary` (#715a3e) provides a muted gold/bronze undertone for subtle highlights without breaking the monotone gravity.

### The "No-Line" Rule

Explicitly prohibit the use of 1px solid borders for sectioning or layout containment. Boundaries must be defined through:

1. **Background Color Shifts:** A section using `surface-container-low` sitting against a `surface` background.
2. **Negative Space:** Using the Spacing Scale to create "invisible walls."
3. **Tonal Transitions:** Moving from `surface-bright` to `surface-dim` to signal a change in content priority.

### Surface Hierarchy & Nesting

Treat the UI as a series of stacked fine papers.

- **Level 1 (Base):** `surface` (#fcf9f8).
- **Level 2 (In-set):** `surface-container-low` for subtle grouping.
- **Level 3 (Interactive):** `surface-container-highest` for high-priority cards or modals.

### The "Glass & Gradient" Rule

To prevent the design from feeling flat or "template-based," use Glassmorphism for floating navigation or overlays. Apply a semi-transparent `surface` with a 20px backdrop-blur. For main CTAs, use a subtle linear gradient from `tertiary` (#274133) to `tertiary-container` (#5f7b6b) to add depth and "soul" to the action.

## 3. Typography

The typographic soul of this system lies in the "High-Low" pairing of a literary serif and a technical sans-serif.

- **Display & Headlines (Newsreader):** Use `display-lg` and `headline-lg` to create editorial impact. These should be treated as graphic elements. Letter-spacing should be slightly tightened for headings to feel more cohesive.
- **Body & Labels (Manrope):** Use `body-md` for all long-form reading. Manrope provides a clean, airy contrast to the serif, ensuring the agency feels modern and efficient.
- **The Hierarchy Strategy:** Typography is our primary navigational tool. A massive `display-sm` heading next to a tiny, wide-tracked `label-sm` creates a luxury "Vogue-esque" contrast that signals high-end positioning.

## 4. Elevation & Depth

In this system, elevation is "felt," not "seen." We reject heavy shadows in favor of tonal layering.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. This "soft lift" provides hierarchy without the visual clutter of 3D effects.
- **Ambient Shadows:** When a float is required (e.g., a dropdown), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(28, 27, 27, 0.05)`. The shadow must feel like a natural light fall-off, not a digital effect.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` (#c6c6c6) at 20% opacity. This "Ghost Border" provides a suggestion of a container without breaking the editorial flow.
- **Sharp Precision:** All containers have a **0px roundedness**. This is non-negotiable. Sharp corners represent the precision and "edge" of the fashion industry.

## 5. Components

### Buttons

- **Primary:** Background `primary` (#000000), text `on-primary`. Sharp corners, generous horizontal padding (32px+).
- **Secondary:** Background `transparent`, "Ghost Border" (`outline-variant` @ 20%), text `primary`.
- **Tertiary (The Emerald Accent):** Background `tertiary` (#274133), text `on-tertiary`. Used exclusively for "Join" or "Contact" flows.

### Input Fields

Avoid the "box" look. Use a single bottom border (`outline-variant` @ 40%) with `label-sm` placed 8px above the line. Upon focus, the border transitions to `primary` (#000000).

### Cards & Lists

**Strictly forbid divider lines.**

- For lists, use `surface-container` background shifts on hover.
- For cards, use `surface-container-lowest` (#ffffff) to create a subtle pop against `surface` (#fcf9f8) backgrounds. Space between items should be 48px or greater.

### The "Press Fragment" (Custom Component)

A signature layout component where an image spans 60% of the container, while a `display-sm` serif heading overlaps the image edge, anchored by a `body-sm` description in a `surface-container-high` box.

## 6. Do's and Don'ts

### Do:

- **Embrace Asymmetry:** Align a heading to the left and the body text to the far right to create a sophisticated, non-linear flow.
- **Use "White Space" as a Color:** Treat empty space as an active design element that adds "air" to the PR agency's presentation.
- **Maintain High Contrast:** Ensure `on-surface` text on `surface` backgrounds meets WCAG AAA standards.

### Don't:

- **Never use Rounded Corners:** 0px is the law of the system. Anything else degrades the high-end editorial feel.
- **Avoid Decorative Icons:** Only use icons for utility (Search, Close, Menu). They must be 1px stroke weight and minimal.
- **No Divider Lines:** Do not use 1px lines to separate content blocks. Use the `surface-container` tiers or spacing instead.
- **Don't Overuse the Accent:** The Deep Emerald (`tertiary`) loses its impact if used for more than 5% of the screen real estate. Use it only for the "Hook."
