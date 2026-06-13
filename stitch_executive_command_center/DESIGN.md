---
name: Executive Command
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#bdc7d9'
  on-secondary: '#27313f'
  secondary-container: '#404a59'
  on-secondary-container: '#afb9cb'
  tertiary: '#ffb596'
  on-tertiary: '#581e00'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d9e3f6'
  secondary-fixed-dim: '#bdc7d9'
  on-secondary-fixed: '#121c2a'
  on-secondary-fixed-variant: '#3d4756'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is engineered for high-stakes executive environments, prioritizing clarity, speed of cognition, and a premium aesthetic. It draws inspiration from modern technical tools, focusing on precision and density without sacrificing elegance.

The brand personality is **authoritative, surgical, and sophisticated**. It targets decision-makers who require a "single pane of glass" view of complex data. The visual style is a blend of **Minimalism** and **Corporate Modern**, utilizing a deep-space palette to reduce eye strain during extended monitoring sessions. 

Key attributes include:
- **Precision Engineering:** Every element is aligned to a strict grid, evoking a sense of reliability.
- **Subdued Sophistication:** Color is used sparingly as a functional signal, never as decoration.
- **Intentional Whitespace:** Large "breathable" margins contrast with high-density data modules to prevent cognitive overload.

## Colors

The palette is anchored in a monochromatic dark range to establish depth and hierarchy. **Blue 600 (#2563EB)** serves as the primary action color, providing high contrast against the dark backgrounds.

- **Background Strategy:** The base layer is a deep charcoal, while surfaces use "Dark Slate" values to create a logical sense of elevation.
- **Functional Colors:** Success, Warning, and Danger colors are calibrated for high legibility against dark surfaces, used strictly for status indicators and destructive actions.
- **Borders:** A consistent grey-blue (#1F2937) defines boundaries between modules, replacing heavy shadows for a cleaner, flatter appearance.

## Typography

This design system utilizes a dual-font strategy. **Geist** is employed for headlines and labels to provide a technical, monospaced-adjacent feel that aids in reading data. **Inter** is used for body copy to ensure maximum readability and a softer, more approachable feel for long-form content.

- **TV View Optimization:** Large display and headline roles are optimized for legibility from a distance, essential for dashboard monitoring.
- **Hierarchy:** Use bold weights (600-700) for headers to create a clear scan-path.
- **Labels:** Small labels use uppercase with slight tracking (0.05em) to differentiate metadata from primary content.

## Layout & Spacing

The layout is built on a rigorous **8px spacing system**. This ensures consistency across all components and viewports.

- **Fluid Grid:** Content utilizes a 12-column fluid grid on desktop.
- **Density:** While whitespace is encouraged between major sections, internal component padding should remain tight (16px - 24px) to maintain a professional, data-rich density.
- **Breakpoints:**
    - **Mobile (<768px):** 1-column layout with 16px margins.
    - **Tablet (768px - 1280px):** 6-column layout with 24px gutters.
    - **Desktop (>1280px):** 12-column layout with 48px global margins for a "premium" feel.

## Elevation & Depth

This design system avoids traditional heavy drop shadows. Depth is communicated through **Tonal Layering** and **Subtle Outlines**.

- **Z-Axis Hierarchy:**
    - **Level 0 (Background):** #070A0F (The canvas).
    - **Level 1 (Cards/Sidebar):** #111827 with a 1px border of #1F2937.
    - **Level 2 (Modals/Popovers):** #171F2E with a 1px border of #374151 and a very soft, high-diffusion shadow (0px 20px 40px rgba(0,0,0,0.4)).
- **Tactile Feedback:** On hover, cards may transition to a slightly lighter border color rather than increasing shadow depth.

## Shapes

The shape language balances the rigid grid with approachable, modern curves. 

- **Standard Radius:** 16px is the default for primary UI containers (Cards, Modals).
- **Large Radius:** 20px (rounded-xl) is reserved for high-level dashboard modules or decorative containers.
- **Interactive Elements:** Buttons and input fields should follow the `rounded-lg` (1rem/16px) standard to match the container curves.

## Components

### Buttons
- **Primary:** Solid #2563EB background with #F8FAFC text. High-contrast, no gradient.
- **Secondary:** Transparent background with a 1px #1F2937 border.
- **Sizing:** Large padding (12px 24px) for an executive, easy-to-click feel.

### Cards
- **Construction:** Surface color #111827, 16px border-radius, 1px border (#1F2937).
- **Header:** Cards should include a distinct header section with a bottom border separating it from the content body.

### Inputs
- **Style:** Background #070A0F (inset look) with #1F2937 border. 
- **Focus State:** Border changes to #2563EB with a 2px outer ring (no blur).

### Status Chips
- **Construction:** Low-opacity background versions of Success/Warning/Danger colors with high-saturation text labels.
- **Example:** Success chip uses #22C55E at 10% opacity for background, and 100% opacity for text.

### Data Visualization
- **Charts:** Use a limited palette. Primary blue for single data sets. Use semantic colors (Success/Danger) for trend indicators.
- **Grid Lines:** Subdued #1F2937, dashed or 0.5px solid.