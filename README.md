# SNIVEL Marketing Site

This is the marketing website for SNIVEL, deployed at **getsnivel.com**.

## What This Site Does

Simple static marketing pages:
- Landing page explaining SNIVEL
- Pricing page
- All CTAs link to `snivel.app` for signup/login

## Local Development

```bash
deno task start
```

Visit http://localhost:8000

## Deploy to Deno Deploy

1. Push this repo to GitHub
2. In Deno Deploy console: https://dash.deno.com
3. Create new project
4. Link to this GitHub repo
5. Set entry point: `main.ts`
6. Add custom domain: `getsnivel.com`

## Structure

```
routes/
├── index.tsx    # Landing page
└── pricing.tsx  # Pricing page
```

No database, no auth, no complex logic. Just clean marketing pages.

## Important Links

All signup/login flows happen on **snivel.app**, not here.
