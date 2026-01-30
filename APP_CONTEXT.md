# getsnivel — Technical Context

## Stack
- **Runtime**: Deno
- **Framework**: Fresh 2.2
- **UI**: Preact + Preact Signals
- **Styling**: Tailwind CSS 4.x
- **Deployment**: Deno Deploy

## Directory Structure
```
getsnivel/
├── routes/
│   ├── _app.tsx                # Root HTML shell
│   ├── _middleware.ts          # API URL resolution
│   ├── index.tsx               # Home page
│   ├── pricing.tsx             # Pricing calculator
│   ├── book-with-snivel.tsx    # Booking feature page
│   ├── snivel.tsx              # Coming soon page
│   ├── terms.tsx               # Terms of service
│   ├── login.tsx               # Admin login
│   ├── signup/
│   │   ├── index.tsx          # Email collection
│   │   ├── check-email.tsx    # Confirmation
│   │   └── complete.tsx       # Post-verification
│   ├── login/
│   │   └── check-email.tsx    # Login confirmation
│   ├── auth/
│   │   └── verify.tsx         # Magic link handler
│   ├── dashboard/
│   │   └── index.tsx          # Protected dashboard
│   ├── _404.tsx               # 404 page
│   └── _500.tsx               # 500 page
├── components/
│   └── Logo.tsx               # Snivel logo
├── islands/                    # (currently minimal)
├── lib/
│   ├── auth/
│   │   └── magic-link.ts     # Token generation
│   ├── email/
│   │   └── resend.ts         # Email sending
│   ├── db/                    # Database queries
│   ├── stripe/                # Payment processing
│   ├── env.ts                 # Environment detection
│   └── signup-api.ts          # Signup API client
├── static/
│   └── logos/                 # Brand assets
└── utils.ts
```

## Page Templates

### Marketing Page Pattern
```typescript
export default function FeaturePage() {
  return (
    <div class="min-h-screen">
      {/* Header */}
      <header class="sticky top-0 bg-white/80 backdrop-blur">
        <nav>
          <Logo />
          <a href="/pricing">Pricing</a>
          <a href="/login">Login</a>
          <a href="/signup" class="btn-primary">Get Started</a>
        </nav>
      </header>

      {/* Content */}
      <main>
        {/* Hero section */}
        {/* Features grid */}
        {/* CTA section */}
      </main>

      {/* Footer */}
      <footer>
        <a href="/pricing">Pricing</a>
        <a href="/terms">Terms</a>
        <a href="/login">Login</a>
      </footer>
    </div>
  );
}
```

### Pricing Calculator Pattern
```typescript
// Client-side JavaScript for dynamic pricing
<script dangerouslySetInnerHTML={{ __html: `
  const tiers = [
    { maxUsers: 5, monthly: 3000, annual: 30000 },
    { maxUsers: 10, monthly: 5400, annual: 54000 },
    // ...
  ];

  function updatePricing(teamSize, isAnnual) {
    const tier = tiers.find(t => teamSize <= t.maxUsers);
    const price = isAnnual ? tier.annual / 12 : tier.monthly;
    document.getElementById('price').textContent = formatCents(price);
  }

  // Slider and toggle event listeners
`}} />
```

## Signup Flow

### Route: `/signup`
```typescript
export const handler = define.handlers({
  async POST(ctx) {
    const formData = await ctx.req.formData();
    const email = formData.get("email");
    const plan = formData.get("plan");

    // Create magic link token
    const token = await createMagicLinkToken({
      email,
      context: { plan },
      expiresIn: 3600, // 1 hour
    });

    // Send email
    await sendMagicLinkEmail(email, token);

    // Redirect to check-email
    return new Response(null, {
      status: 302,
      headers: { Location: `/signup/check-email?email=${email}&plan=${plan}` },
    });
  },
});
```

### Route: `/auth/verify`
```typescript
export const handler = define.handlers({
  async GET(ctx) {
    const token = ctx.url.searchParams.get("token");

    // Validate token
    const result = await verifyMagicLinkToken(token);
    if (!result.valid) {
      return ctx.render({ error: "Invalid or expired link" });
    }

    // Create session
    const session = await createSession(result.userId);

    // Redirect to dashboard
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/dashboard",
        "Set-Cookie": `snivel_auth=${session.token}; Path=/; HttpOnly; Secure`,
      },
    });
  },
});
```

## Component: Logo
```typescript
// components/Logo.tsx
interface Props {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function Logo({ size = "md", className }: Props) {
  const sizes = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
    xl: "h-12",
  };

  return (
    <a href="/" class={`flex items-center gap-2 ${className}`}>
      <img src="/logos/snivel-icon.svg" class={sizes[size]} alt="Snivel" />
      <span class="font-semibold text-gray-900">SNIVEL</span>
    </a>
  );
}
```

## Environment Variables
```
SNIVEL_API_URL          # API base URL
RESEND_API_KEY          # Email sending
STRIPE_SECRET_KEY       # Payment processing
```

## Timeline Support

Same pattern as other apps:
- Production: `getsnivel.com` / `www.snivel.app`
- Timeline: `getsnivel--{branch}.odov.deno.net`

## SEO & Meta

### Page Titles
- Home: "Snivel — Scheduling That Works"
- Pricing: "Pricing — Snivel"
- Book with Snivel: "Book with Snivel — Professional Booking Pages"

### Open Graph (to add)
```html
<meta property="og:title" content="Snivel — Scheduling That Works" />
<meta property="og:description" content="Professional booking pages and team scheduling" />
<meta property="og:image" content="https://getsnivel.com/og-image.png" />
```

## Analytics (to add)
Currently no analytics. Consider:
- Plausible (privacy-friendly)
- Google Analytics
- Custom events for conversion tracking
