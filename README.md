# DJ Cline - Portfolio

This is the source code for my personal portfolio website, built with React, Vite, and Tailwind CSS. The site is deployed on GitHub Pages.

## Development

To run the project locally, clone the repository and run the following commands:

```bash
npm install
npm run dev
```

<!-- Trigger deployment again -->

## Note on AI Lab

The experimental AI Lab section and related provider integrations have been removed to streamline the portfolio.

## Current Status

- Live site: https://dclineitpro.github.io/portfolio/
- Tech stack: React + Vite + TypeScript + Tailwind CSS
- Recent change: AI Lab removed (UI, code, and docs) to simplify the site
- Background: Executive gradient + indigo letter rain
  - Honors reduced motion (animation disabled when enabled in OS/browser)
  - Disabled on mobile (<768px) for performance and comfort

## How to Continue Later

1) Get the latest code
```bash
git pull
```

2) Run locally
```bash
npm install
npm run dev
```

3) Make updates (typical entry points)
- Content and layout:
  - `src/components/EnhancedHero.tsx`
  - `src/components/About.tsx`
  - `src/components/Experience.tsx`
  - `src/components/Skills.tsx`
  - `src/components/CertificationsFrameworks.tsx`
  - `src/components/AuditOutcomes.tsx`
  - `src/components/SkillsMatrix.tsx`
  - `src/components/Achievements.tsx`
  - `src/components/Contact.tsx`
- Global shell/navigation:
  - `src/components/Header.tsx`
  - `src/components/Footer.tsx`
- Styling/utilities:
  - `src/index.css` (Tailwind utilities and custom CSS)

4) Commit and push
```bash
git add -A
git commit -m "Update content/styles"
git push
```

## Deployment

- Deploys automatically via GitHub Actions on push to `main` (publishes to `gh-pages`).
- To check deployment: GitHub → repository → Actions → latest workflow run.
- If GitHub Pages doesn’t update, verify the workflow completed successfully and the Pages branch is set to `gh-pages` in repository settings.

## Project Structure (high level)

- `src/App.tsx` – page composition (order of sections)
- `src/components/*` – individual sections and UI building blocks
- `src/components/LetterRainBackground.tsx` – indigo letter rain background (desktop only)
- `src/index.css` – Tailwind base and custom styles
- `public/` – static assets (e.g., profile image)

## Scripts

```bash
npm run dev      # Start local dev server
npm run build    # Production build
npm run preview  # Preview production build locally
```
