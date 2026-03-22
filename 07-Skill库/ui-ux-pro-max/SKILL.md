---
name: ui-ux-pro-max
description: AI-powered UI/UX design intelligence toolkit. Use when designing user interfaces, choosing color palettes, selecting typography, creating design systems, or needing UI style recommendations. Contains 50+ styles, 161 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types.
allowed-tools: Bash(python3 src/ui-ux-pro-max/scripts/search.py *)
---

# UI/UX Pro Max - Design Intelligence

Comprehensive design guide for web and mobile applications. Contains 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 technology stacks.

## When to Apply

Must use for:
- Designing new pages (Landing Page, Dashboard, Admin, SaaS, Mobile App)
- Creating UI components (buttons, modals, forms, tables, charts)
- Choosing color schemes, typography, spacing standards
- Reviewing UI code for UX, accessibility, visual consistency
- Implementing navigation structures, animations, responsive behavior
- Building design systems

## Quick Start

```bash
# Generate complete design system
python3 src/ui-ux-pro-max/scripts/search.py "<product_type>" --design-system -p "Project Name"

# Domain-specific search
python3 src/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain>

# Stack-specific guidelines
python3 src/ui-ux-pro-max/scripts/search.py "<keyword>" --stack <stack>
```

## Available Domains

| Domain | Use For |
|--------|---------|
| `product` | Product type recommendations |
| `style` | UI styles (glassmorphism, minimalism, etc.) |
| `typography` | Font pairings |
| `color` | Color palettes |
| `landing` | Page structure, CTA strategies |
| `chart` | Chart types, libraries |
| `ux` | Best practices, anti-patterns |
| `prompt` | AI prompts, CSS keywords |

## Available Stacks

- `react`, `nextjs`, `astro`, `vue`, `nuxtjs`
- `svelte`, `swiftui`, `react-native`, `flutter`
- `shadcn`, `jetpack-compose`, `html-tailwind`

## Example Workflow

```bash
# Step 1: Generate design system
python3 src/ui-ux-pro-max/scripts/search.py "fintech crypto modern" --design-system -p "CryptoApp"

# Step 2: Get style options
python3 src/ui-ux-pro-max/scripts/search.py "dark mode glassmorphism" --domain style

# Step 3: Get UX best practices
python3 src/ui-ux-pro-max/scripts/search.py "animation accessibility" --domain ux

# Step 4: Stack guidelines
python3 src/ui-ux-pro-max/scripts/search.py "performance" --stack react-native
```

## Requirements

- Python 3.8+
- pip install pandas openai

## Quick Reference

### Accessibility (CRITICAL)
- Contrast ratio ≥4.5:1
- Touch targets ≥44×44px
- Visible focus states
- Alt text for images

### Performance (HIGH)
- WebP/AVIF images
- Lazy loading
- Reserve space (CLS < 0.1)

### Style Selection (HIGH)
- Match style to product type
- Consistency across pages
- Use SVG icons (not emoji)
