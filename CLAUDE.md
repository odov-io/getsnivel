# getsnivel

Public marketing site and signup funnel. First thing prospects see.

## Role
- Marketing pages (home, book-with-snivel, pricing)
- Signup flow (email → magic link → account creation)
- Login flow (magic link → session → redirect to product)
- **Owns all legal pages**: Privacy Policy, Terms of Service, Accessibility Statement

## When This App Is Affected
- New product or feature to market → new page or update existing
- Pricing/plan changes → update pricing.tsx (both display AND the JS tier data)
- New third-party integration → Privacy Policy update
- New data collection → Privacy Policy update
- Billing model changes → Terms of Service update
- Accessibility changes → Accessibility Statement update

## Key Rules
- This is the PUBLIC face — performance, SEO, and polish matter most here
- Legal pages use `prose prose-gray max-w-none` styling
- Footer links on ALL pages: Pricing, Terms, Privacy, Accessibility, Login
- No auth required on marketing pages
- Signup/login pages proxy to snivel-api for account creation and session

## See APP_CONTEXT.md for full technical details (routes, signup flow, widget code)
