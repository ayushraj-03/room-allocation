# UI/UX Design System Specification

## 1. Design Philosophy: Heritage Jesuit Academic Aesthetic

The user interface of the **St. Xavier's College Room Allocation System** is designed specifically to mirror the historic architecture, heraldry, and academic dignity of St. Xavier's College (Autonomous), Mumbai (founded in 1869).

The interface purposefully rejects generic modern corporate SaaS designs (e.g. flat blue/gray Tailwind) in favor of:
* **Deep Institutional Maroon & Gold**: Evoking the collegiate blazer, crest, and library woodwork.
* **Warm Cream Canvases**: Soft, parchment-like backgrounds that reduce visual fatigue.
* **Subtle Structural Borders**: Refined warm borders instead of heavy drop-shadows.
* **Typographic Dignity**: Elegant serif display headers paired with highly legible tabular data typography.

---

## 2. Design Tokens & Color Palette

The design tokens are declared as CSS variables in [`xavier-theme.css`](file:///Users/ayush/Projects/college%20room%20allocation%20system/room-allocation/src/main/resources/static/css/xavier-theme.css):

```css
:root {
    /* Primary Institutional Jesuit Palette */
    --xavier-maroon: #741114;
    --xavier-maroon-dark: #5c0b0e;
    --xavier-maroon-light: #8e1b1f;
    --xavier-maroon-subtle: rgba(116, 17, 20, 0.08);

    /* Backgrounds & Canvas */
    --xavier-cream: #faf7f2;
    --xavier-cream-dark: #f0ebe1;
    --xavier-cream-card: #ffffff;
    
    /* Academic Gold Accents */
    --xavier-gold: #b38728;
    --xavier-gold-dark: #8c6818;
    --xavier-gold-light: #fef8e7;

    /* Typography & Ink */
    --text-main: #1e2430;
    --text-muted: #5c6475;
    --text-light: #8a94a6;

    /* Structural Borders */
    --border-warm: #e5ded2;
    --border-subtle: #eee8de;

    /* Status Semantics */
    --status-pending-bg: #fffbeb;
    --status-pending-text: #b45309;
    --status-pending-border: #fcd34d;

    --status-hod-bg: #eff6ff;
    --status-hod-text: #1d4ed8;
    --status-hod-border: #bfdbfe;

    --status-approved-bg: #f0fdf4;
    --status-approved-text: #15803d;
    --status-approved-border: #bbf7d0;

    --status-rejected-bg: #fef2f2;
    --status-rejected-text: #b91c1c;
    --status-rejected-border: #fecaca;

    /* Radius & Transitions */
    --radius-sm: 4px;
    --radius-md: 8px;
    --transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 3. Component Architecture & Guidelines

### 3.1. Top Institutional Strip (`.xavier-top-strip`)
* Sits at the absolute apex of every authenticated page.
* Deep Maroon background (`--xavier-maroon-dark`).
* Displays college links (`xaviers.edu`, `NIRF`, `IQAC`), autonomous accreditation badge, and session controls.

### 3.2. Institutional Header (`.xavier-header`)
* Displays the official crest (`/images/xavier-logo.png`), institution title (*St. Xavier's College (Autonomous), Mumbai*), and the portal badge (e.g., *Student Portal*, *HOD Endorsement Portal*, *Central Administration*).
* Features a refined gold border underline (`border-bottom: 2px solid var(--xavier-gold)`).

### 3.3. Metric & Stat Cards (`.stat-card`)
* Elevated card container on white canvas (`#ffffff`) with warm borders (`--border-warm`).
* Displays a large numeric counter in deep maroon and an uppercase gold/muted descriptor label below.

### 3.4. Status Badges (`.badge`)
Each requisition state maps directly to a high-contrast institutional pill badge:
* **PENDING**: Amber pill badge (`background: var(--status-pending-bg)`, `color: var(--status-pending-text)`).
* **HOD_APPROVED**: Blue pill badge (`background: var(--status-hod-bg)`, `color: var(--status-hod-text)`).
* **APPROVED**: Emerald pill badge (`background: var(--status-approved-bg)`, `color: var(--status-approved-text)`).
* **REJECTED**: Crimson pill badge (`background: var(--status-rejected-bg)`, `color: var(--status-rejected-text)`).

### 3.5. Action Buttons
* **Primary Action (`.btn-primary`)**: Deep maroon button with gold hover elevation, used for form submissions, bookings, and sanctions.
* **Secondary Action (`.btn-secondary`)**: Off-white/cream button with warm border, used for filters, cancelations, and downloads.
* **Destructive Action (`.btn-danger`)**: Crimson button used for rejections and room decommissioning.

---

## 4. Responsive Layout System

* **Desktop ($\ge 1024\text{px}$)**: Two-column grid (`1fr 1.5fr` or `1fr 2fr`) separating the interactive booking form from the real-time history/schedule table.
* **Tablet & Mobile ($< 960\text{px}$)**: Automatically collapses into a single-column stacked layout with horizontal scroll containers on tabular schedules to prevent layout breakage on smartphones.
