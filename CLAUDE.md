# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Keebfolio is an Astro 5 static site that catalogs open-source mechanical keyboard projects. Uses the terminal theme (Fira Code font, dark background with golden accent).

## Commands

```bash
npm run dev        # Start dev server at localhost:4321
npm run build      # Production build (runs image download first)
npm run check      # Type checking (astro check + tsc)
npm run cleanup    # Remove unused downloaded images
npm run preview    # Preview production build
```

## Architecture

**Theme**: Terminal-inspired design with CSS custom properties in `src/styles/terminal.css`

**Layouts**:
- `src/layouts/BaseLayout.astro` - Main layout with header navigation and footer
- `src/layouts/MarkdownLayout.astro` - Wrapper for markdown content pages

**Content System**: Astro Content Collections with Zod schema
- Keyboard entries: `src/content/keyboards/{staggered,ortholinear,split,other}/*.md`
- Schema: `src/content/config.ts`

**Pages**:
- Category pages: `src/pages/en/{staggered,ortholinear,split,other}.astro`
- Resource pages: `src/pages/en/{firmware,tools,tutorials,miscellaneous}.md`
- Homepage: `src/pages/index.astro`

**Automated Image Pipeline**: Remote image URLs in frontmatter are downloaded and converted to WebP during build (`scripts/download_images.mjs`).

**Contributors Pipeline**: GitHub contributors for each page are fetched during prebuild and cached in `src/data/contributors.json`. Avatars are displayed at the bottom of each page (`scripts/fetch_contributors.mjs`).

**Updates Pipeline**: Recent commits are fetched during prebuild and filtered by conventional commit prefixes (`docs:`, `feat:`). Cached in `src/data/updates.json` and displayed on the homepage (`scripts/fetch_updates.mjs`).

**Client Scripts**: TypeScript modules for browser functionality
- `src/scripts/menu.ts` - Dropdown menu logic with click-outside detection
- `src/scripts/scroll-to-top.ts` - Scroll button with keyboard accessibility
- `src/scripts/theme-switcher.ts` - Theme management with OS preference detection

## Adding Keyboard Entries

Create a Markdown file in `src/content/keyboards/[category]/` with this frontmatter:

```yaml
---
name: "Keyboard Name"
url: "https://github.com/..."
category: "split"  # staggered, ortholinear, split, or other
tags: "tag1, tag2"
image: "https://..."  # Remote URL - will be auto-downloaded
---
```

## Key Files

- `src/config.ts` - Site metadata and URLs
- `src/content/config.ts` - Content collection schema
- `src/styles/terminal.css` - Theme colors and base styles
- `src/components/KeyboardGrid.astro` - Keyboard card grid component
- `src/scripts/*.ts` - Client-side TypeScript modules (menu, scroll, theme)
- `scripts/download_images.mjs` - Image download and WebP conversion
- `scripts/fetch_contributors.mjs` - GitHub contributors fetch with caching
- `scripts/fetch_updates.mjs` - Git commit history fetch with filtering
- `src/components/Contributors.astro` - Contributors avatar display
- `src/components/Updates.astro` - Recent updates display with keyboard shortcut
