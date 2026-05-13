# PT NEXUS CHEM BRIDGE Design System

## Register

Brand website for a B2B industrial chemical trading and brokerage company. Design is part of credibility: the interface must make the company feel registered, international, precise, and commercially serious.

## Physical Scene

A procurement director or supplier representative reviews the site on a laptop during business hours, comparing the company details against documents before deciding whether to send an inquiry. The interface should feel calm, legible, and exact under normal office light.

This points to a light, neutral system with restrained contrast and one warm industrial accent.

## Visual Direction

Minimal, editorial, and corporate. Inspired by the provided references: large quiet surfaces, strong whitespace, compact navigation, refined typography, image-led bands, and disciplined CTA placement. The structure must differ from the references and fit a chemical trading company.

The design should avoid decorative chemistry tropes. No cartoon molecules, no neon lab imagery, no AI-purple gradient surfaces, no generic three-card feature row.

## Color Strategy

Use a restrained palette. The accent should stay below roughly 10% of the surface.

- Page background: warm off-white, not pure white
- Primary surface: tinted paper white
- Text: graphite, not pure black
- Muted text: slate grey
- Lines and dividers: pale industrial grey
- Accent: muted safety orange or mineral coral
- Dark frame option: charcoal for outer stage areas, not pure black

Initial tokens:

- `--bg`: `oklch(0.975 0.006 75)`
- `--surface`: `oklch(0.992 0.004 75)`
- `--text`: `oklch(0.19 0.012 245)`
- `--muted`: `oklch(0.45 0.015 245)`
- `--line`: `oklch(0.87 0.01 245)`
- `--accent`: `oklch(0.68 0.145 38)`
- `--accent-dark`: `oklch(0.52 0.12 36)`
- `--charcoal`: `oklch(0.16 0.006 245)`

## Typography

Use `Be Vietnam Pro` for headings and navigation, with `Noto Sans` for body copy. This supports an international tone and avoids the default AI look.

Use monospace sparingly for identifiers:

- NIB
- NPWP
- KBLI codes
- Product specification labels when added later

No Inter. No gradient text. No oversized shouting H1.

## Layout

Use a minimal multi-page architecture:

- Home
- Products
- About Us
- Contact Us

Layout rhythm should use large but not empty whitespace. Favor asymmetry over centered hero composition on desktop. Mobile collapses to a strict single column.

Preferred patterns:

- Slim sticky navigation with direct links and a clear Contact CTA
- Hero with editorial split: company positioning on one side, abstract industrial/photo material on the other
- Full-width image or material bands with gentle parallax
- Product list with restrained line-based rows or asymmetric tiles, not identical icon cards
- Legal/company profile in a clean table-like layout
- Contact form with labels above inputs, helper text, inline validation states

## Motion

Minimalism should be supported by motion, not decoration.

Use Lenis for smooth scrolling across the site. Pair it with small parallax shifts on image bands, product rows, and background surfaces. Motion should feel slow, heavy, and commercial.

Motion rules:

- Animate only transform and opacity
- No bounce or elastic easing
- Use ease-out-quart, ease-out-quint, or similar exponential easing
- Respect `prefers-reduced-motion`
- Keep hover states tactile but quiet
- CTA active state may use a small `translateY(1px)` or `scale(0.98)`
- Parallax must be subtle and never make text hard to read
- No cursor gimmicks
- No decorative glassmorphism

## UX Rules

- All CTA routes should lead to the Contact Us form.
- Contact form fields should include name, company, email, product interest, inquiry type, and message.
- Product details are provisional until exact product names are supplied.
- Keep company registration details visible on About Us and Contact Us.
- Do not hide legal trust details in a footer only.
- Focus states must be visible.
- Mobile navigation must be clear and stable.

## Page Notes

### Home

Purpose: quickly establish what the company does and invite a supply inquiry.

Sections:

- Hero with company positioning and primary CTA
- Trading scope
- Planned product categories preview
- Registration and business activity trust strip
- Contact CTA band

### Products

Purpose: show planned product categories and route each inquiry to Contact Us.

Initial product slots:

- Methanol
- Cyclohexane
- Urea
- Caprolactam
- Fertilizers
- Basic chemical commodities

### About Us

Purpose: show company legitimacy and operating scope.

Include legal name, NIB, NPWP, address, director, shareholders, KBLI activities, and business scope.

### Contact Us

Purpose: convert visitors into commercial inquiries.

Include the form first, then company legal/contact details. CTA anchors from every page should target the form.

## Impeccable Notes

This is a brand register. Use the restrained color strategy unless a later visual direction explicitly asks for more color. The first-order category reflex to avoid is "chemical company equals blue lab website." The second-order reflex to avoid is "industrial company equals dark cyberpunk grid." The site should feel like a polished trading office, not a laboratory or software dashboard.
