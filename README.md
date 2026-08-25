# Meridian — the Apature Gate gallery app

A small but real web app: a product marketing page and a deploy dashboard, built
with Vite and vanilla ES modules, with its design system in one token file.

It exists to be reviewed. Every pull request here runs
[Apature Gate](https://github.com/apatureai/gate), which builds the app on the
runner, screenshots the rendered pages, hands them to a critique service, and
posts the review back as one sticky comment plus a Check Run. If you want to see
what a Gate review actually looks like on a real diff, read the pull requests.

## The app

| Page | What it is |
|---|---|
| `/` | Marketing site — hero, logo wall, features, metrics, pricing, CTA, footer. |
| `/dashboard.html` | Signed-in view — sidebar, stat row, latency chart, deploy table. |

No framework and no CSS library, on purpose: what the page renders is exactly
what the stylesheets say, so a design review has nothing to blame but the CSS.

```
src/tokens.css        every colour, size, space, radius and shadow
src/base.css          reset + buttons, badges, cards
src/marketing.css     the marketing page
src/dashboard.css     the dashboard
design-tokens.json    DTCG mirror of tokens.css (what .gate.yml points at)
```

`pnpm check:tokens` fails if `design-tokens.json` and `src/tokens.css` disagree.

## Running it

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev                # vite dev server on :5173
# or
pnpm build && pnpm preview   # static build served on :4173 (honours $PORT)
```

## The design review

[`.github/workflows/gate.yml`](.github/workflows/gate.yml) is
`examples/gate.yml` from the Gate repository with one change: this repository has
no deploy provider, so Gate runs the build itself under its own supervisor via
`preview-command` and reviews the server it starts.

[`.gate.yml`](.gate.yml) says which routes and viewports to review, what the
brand is meant to feel like, and which design tokens the review should hold the
page to.

Gate ships no critique service; it calls one you host. This repository points at
a self-hosted [`verdict`](https://github.com/apatureai/verdict) via two
repository secrets, `GATE_ENGINE_ENDPOINT` and `GATE_ENGINE_HMAC_SECRET`. With
neither set, the workflow still runs and publishes a neutral *Engine not
configured* Check Run rather than a green one — a passing check never means
"nothing looked at it".

## Licence

MIT. Meridian is not a real company; the numbers on these pages are fixtures.
