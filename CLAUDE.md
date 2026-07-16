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

**Single-page app with view-based navigation** — no router. `App.tsx` manages a typed `view` state (`'home' | 'software' | 'printing3d' | 'media' | 'games'`) that switches between views inline.

### Key layers

- **XMBWaveBackground** — Full-screen WebGL animated wave background (PS3 XMB style). Uses raw WebGL with custom vertex/fragment shaders. Configured via props in `App.tsx` constants (`WAVE_COLOR`, `SPEED_MULTIPLIER`, etc.).
- **BlogView** — Fetches markdown content from `public/content/*.md` at runtime and renders it with `react-markdown`, GFM, and raw HTML support. New editorial images live in `public/uploads/` and require no React import. Legacy `/assets/` image references are resolved automatically through a Vite glob.
- **GamesView** — Canvas-based game engine. Games implement a `run(canvas, ctx, onScore) => cleanup` interface. New games are added to the `GAMES` array in `GamesView.tsx`. Currently has Tetris (`src/games/tetris.ts`).
- **Local content editor** — Decap CMS lives in `editor/admin/` and is started with `npm run content`. A filesystem proxy bound to localhost edits Markdown sections and uploads media into `public/uploads/`. The editor is not included in production builds.

### Bilingual support

The UI supports Spanish (`es`) and English (`en`) via a `TRANSLATIONS` object in `App.tsx`. Spanish is the default. The language toggle is in the left sidebar.

### Styling

Components use CSS Modules (`*.module.css`) for scoped styles. Global styles are in `App.css` and `index.css`. The `.glow-border` and `.text-*` utility classes are defined globally in `App.css`.

### Static assets

- `src/assets/` — Images, icons, CV PDF (imported by components via Vite)
- `public/` — Favicons, `robots.txt`, `sitemap.xml`, Open Graph image
- SEO metadata (Open Graph, Twitter Cards, JSON-LD structured data) is in `index.html`

### Deployment

GitHub Actions builds and deploys `dist/` to GitHub Pages on every push to `main`. The `base` in `vite.config.ts` is set to `"/"` (custom domain).
