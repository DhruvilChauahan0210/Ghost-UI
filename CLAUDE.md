# Ghost UI — Claude Code Guidelines

## Styling

**Use Tailwind classes everywhere. Never write custom CSS files.**

- All styling goes through Tailwind utility classes inline in JSX/TSX.
- The only CSS file allowed per app is a single `globals.css` that contains:
  - `@import "tailwindcss"`
  - `@theme` token definitions
  - Base resets (`*, html, body`)
  - `@keyframes` definitions (consumed via Tailwind `animate-[...]` arbitrary utilities)
- Do not create `.css` files for components, pages, or features.
- Do not use CSS Modules, styled-components, or any other CSS-in-JS solution.
- Do not use inline `style={{}}` props unless a value is dynamic and cannot be expressed as a Tailwind class (e.g. `style={{ width: \`${score * 100}%\` }}`).

### Tailwind version

This monorepo uses **Tailwind v4**.

- Apps using Vite: install `@tailwindcss/vite` and add `tailwindcss()` to `vite.config.ts` plugins.
- Apps using Next.js: install `@tailwindcss/postcss` and configure `postcss.config.mjs`.
- The `@import "tailwindcss"` directive in `globals.css` replaces the old `@tailwind base/components/utilities` directives from v3.

---

## Code style

- No comments unless the **why** is genuinely non-obvious.
- No `console.log` left in committed code.
- Prefer editing existing files over creating new ones.
- Tests live alongside source in the same package (`*.test.ts`).
