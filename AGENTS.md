# yashikota.com

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

Use **Bun** as the package manager for this project.

## Development Commands

| Command | Purpose |
|---------|---------|
| `bun dev` | Start development server |
| `bun run build` | Production build (includes type checking) |
| `bun run deploy` | Deploy to Cloudflare |
| `bun run check` | Format & lint with Biome |

## Architecture Overview

- **Framework**: Astro + React + Tailwind CSS + shadcn/ui
- **Hosting**: Cloudflare Workers
- **Content**: Markdown-based blog system with unified/remark/rehype pipeline

## Directory Structure

- `src/pages/` - Astro file-based routing
- `src/components/ui/` - shadcn/ui components
- `src/components/shadcn/` - Custom React components
- `src/content/blog/` - Markdown blog posts
- `src/lib/` - Utilities (markdown.ts, posts.ts, custom remark plugins)
- `src/data/` - Data files (works.json, posts.json)

## Markdown Pipeline

The markdown processing in `src/lib/markdown.ts` uses:

**Remark plugins:**
- GFM (GitHub Flavored Markdown)
- Math expressions
- YouTube embeds
- Link cards

**Rehype plugins:**
- Code highlighting (Expressive Code)
- KaTeX for math rendering
- TOC generation
- External link processing
