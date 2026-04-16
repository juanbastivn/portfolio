# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website for Juan-Bastián Espinoza Caimanque, deployed to https://jbastian.cl via GitHub Pages. Built with React 19, TypeScript, and Vite.

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build` (runs `tsc -b && vite build`)
- **Lint:** `npm run lint`
- **Deploy:** `npm run deploy` (builds then publishes `dist/` via gh-pages)
- **Preview production build:** `npm run preview`

## Architecture

**Single-page app with view-based navigation** — no router. `App.tsx` manages a `view` state (`'home' | 'software' | 'media' | 'games'`) that switches between views inline.

### Key layers

- **XMBWaveBackground** — Full-screen WebGL animated wave background (PS3 XMB style). Uses raw WebGL with custom vertex/fragment shaders. Configured via props in `App.tsx` constants (`WAVE_COLOR`, `SPEED_MULTIPLIER`, etc.).
- **BlogView** — Renders markdown content from `src/content/*.md` files using `react-markdown` with GFM and raw HTML support. Images in markdown use a virtual `/assets/` path that maps to Vite-imported assets via an `assetMap` in `BlogView.tsx`. To add a new image to blog content: import it in `BlogView.tsx` and add it to `assetMap`.
- **GamesView** — Canvas-based game engine. Games implement a `run(canvas, ctx, onScore) => cleanup` interface. New games are added to the `GAMES` array in `GamesView.tsx`. Currently has Tetris (`src/games/tetris.ts`).
- **CustomCursor** — Custom cursor replaces the native cursor (CSS `cursor: none` is set globally in `index.css`).

### Bilingual support

The UI supports Spanish (`es`) and English (`en`) via a `TRANSLATIONS` object in `App.tsx`. Spanish is the default. The language toggle is in the left sidebar.

### Styling

Components use CSS Modules (`*.module.css`) for scoped styles. Global styles are in `App.css` and `index.css`. The `.glow-border` and `.text-*` utility classes are defined globally in `App.css`.

### Static assets

- `src/assets/` — Images, icons, CV PDF (imported by components via Vite)
- `public/` — Favicons, `robots.txt`, `sitemap.xml`, Open Graph image
- SEO metadata (Open Graph, Twitter Cards, JSON-LD structured data) is in `index.html`

### Deployment

Uses `gh-pages` package to deploy `dist/` to GitHub Pages. The `base` in `vite.config.ts` is set to `"/"` (custom domain).
