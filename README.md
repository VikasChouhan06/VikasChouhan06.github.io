# Vikas Chouhan — QA portfolio

Static one-page portfolio. No framework, no build step, no npm dependencies.

## Files

| File | What's in it |
|---|---|
| `index.html` | Document shell, static sections, the companion SVG |
| `styles.css` | Design tokens, layout, all breakpoints |
| `data.js` | Projects, skills, experience bullets, companion lines |
| `app.js` | Renders the data-driven sections, disclosures, scroll state, companion |

Only external resource: the Google Fonts stylesheet (Young Serif, Geist, Geist Mono).

## Run it

```sh
python -m http.server 8777
# http://127.0.0.1:8777
```

Opening `index.html` directly from the filesystem also works.

## Deploy

Drop the folder on any static host — GitHub Pages, Netlify, Vercel, Cloudflare Pages.
Nothing to build.

## Editing content

All copy lives in `data.js`:

- `PROJECTS` — each entry has `name`, `context`, `tags`, `stations` (the flow
  diagram), `branches` (the fan-out at the end of the flow), `bug` (index of the
  station that gets the red bug marker) and `tested` (the disclosure list).
- `SKILLS` — `[name, [items...]]`; the count badge is derived from the array length.
- `BULLETS` — the experience list.
- `HERO_J` / `BUG_J` / `SKILL_J` / `CONTACT_J` — the companion's lines.

Colours and type are CSS custom properties at the top of `styles.css`.

## The companion

The character bottom-right is driven by `app.js`. It:

- starts at the hero anchor, then flies to the bottom-right corner as you scroll
- docks into the contact section at the end of the page
- swaps arm poses per section (net → magnifier → clipboard → asleep on the Esc key)
- tracks the cursor with its eyes, blinks, walks while you scroll, mirrors when
  you scroll up
- releases a bug from its net when you leave the hero and re-catches it at the
  first project flow
- speaks on hover/click; bug markers in the flows have their own reports

Everything respects `prefers-reduced-motion`, and the whole character is
dismissable for the session on narrow screens (persisted to `sessionStorage`).

## Accessibility notes

- Flows are ordered lists, so screen readers get the steps and their count, and
  the bug button inside a flow stays reachable.
- The résumé preview is a native `<dialog>`; on touch devices, where browsers
  won't render a PDF in an iframe, the file opens in a new tab instead.
- Disclosures use `aria-expanded` / `aria-controls`; panels animate with
  `grid-template-rows` so content stays in the accessibility tree.
- Hit targets are 44px minimum; the active nav item carries `aria-current`.
