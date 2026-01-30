# getsnivel — Agent Context

## Soul / Purpose
**Marketing and signup**. The public face of Snivel. Product information, pricing, feature marketing, and the entry point for new customers.

## What This App Owns
- **Product Marketing**: Feature pages, comparisons
- **Pricing**: Plan details, tier calculator
- **Signup Flow**: Email collection, magic link verification
- **Terms & Legal**: Terms of service, privacy policy
- **Brand**: Visual identity, messaging

## Code Patterns

### Static Marketing Pages
```typescript
// routes/pricing.tsx - Server-rendered with client-side interactivity
export default function PricingPage() {
  return (
    <div>
      {/* Static content */}
      <script dangerouslySetInnerHTML={{ __html: `
        // Client-side price calculator
      `}} />
    </div>
  );
}
```

### Signup Flow
```
/signup              → Email collection
/signup/check-email  → "Check your email" confirmation
/signup/complete     → Post-verification onboarding
/auth/verify         → Magic link verification
```

## Signature Feature Status

### ✅ Current
- **No dedicated signatures page** — Not yet marketed separately
- **Bundled with "Book with Snivel"** — Signatures are an add-on

### 🚧 Needs When Signatures Launch as Product
- [ ] **Feature page**: `/sigs-by-snivel` with feature showcase
- [ ] **Pricing section**: Add-on pricing or bundled tiers
- [ ] **Screenshots**: Template editor, deployment, signature examples
- [ ] **Comparison**: vs. other signature tools (Exclaimer, WiseStamp)
- [ ] **FAQ**: Common questions about signatures

## Key Files
| File | Purpose |
|------|---------|
| `routes/index.tsx` | Home page with product grid |
| `routes/pricing.tsx` | Pricing calculator |
| `routes/book-with-snivel.tsx` | Booking feature showcase |
| `routes/snivel.tsx` | Coming soon page |
| `routes/terms.tsx` | Terms of service |
| `routes/signup/index.tsx` | Signup form |
| `routes/auth/verify.tsx` | Magic link handler |
| `components/Logo.tsx` | Snivel logo component |

## Current Product Marketing

### Home Page Products
1. **Book with Snivel** — "Available Now"
   - Professional booking pages
   - Calendar sync, intake forms, approval workflows

2. **Snivel** — "Coming Soon"
   - Internal availability, PTO tracking
   - Team scheduling

### Future: Sigs by Snivel
Needs its own section on home page and dedicated feature page.

## Pricing Structure (Current)

### Solo Plan
- $6/month or $60/year
- 1 user
- 30-day free trial

### Team Plans
| Users | Monthly | Annual |
|-------|---------|--------|
| Up to 5 | $30 | $300 |
| Up to 10 | $54 | $540 |
| Up to 25 | $120 | $1,200 |
| Up to 50 | $210 | $2,100 |
| Up to 75 | $288 | $2,880 |
| Up to 100 | $360 | $3,600 |
| 100+ | $3.60/user | - |

### Signature Add-on Pricing (to add)
- Starter: $1.00/user/month
- Professional: $1.50/user/month
- Business: $2.00/user/month

## Marketing Messaging

### Current Taglines
- "Scheduling That Works"
- "Half the price. All the features."
- "Professional booking pages for clients and customers"

### Signature Messaging (suggested)
- "Sigs by Snivel — Email signatures that actually get deployed"
- "Professional signatures for your entire team, in minutes"
- "Gmail & Outlook deployment. No IT required."

## Authentication Flow

### Signup
1. User enters email at `/signup?plan=solo` or `/signup?plan=team`
2. Magic link token created and emailed
3. User clicks link → `/auth/verify?token=...`
4. Token validated, session created
5. Redirect to dashboard or onboarding

### Login
1. User enters email at `/login`
2. Magic link sent
3. Click → verify → session → dashboard

## Environment Variables
```
SNIVEL_API_URL          # API for signup/auth
RESEND_API_KEY          # Email sending
```

## Missing for Signatures Launch
1. Feature page with screenshots
2. Pricing calculator update
3. Home page section
4. FAQ content
5. Comparison page (vs Exclaimer, WiseStamp, etc.)
6. Integration guide (Gmail, Outlook setup)
