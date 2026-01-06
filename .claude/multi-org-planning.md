# Multi-Org Architecture Planning

## The Problem

User signs up with `david@odov.io` → creates user slug `david-kelso`
Later signs up with `david@delapcpa.com` → tries to create `david-kelso` → **COLLISION**

Same person, multiple orgs, need to figure out identity + billing + URLs.

---

## Decided: Model B - Account Linking

One user identity, multiple verified emails, can be member of multiple orgs.

```
User (global identity)
├── id: uuid
├── slug: "david-kelso" (globally unique)
├── emails: [david@odov.io, david@delapcpa.com, david@aprio.com]
├── primaryEmail: david@odov.io
├── hasOwnSubscription: boolean (pays for solo/own org)
└── primaryOrgSlug: "odov" (for vanity URL default)
```

```
OrgMembership
├── orgId
├── userId
├── email (which of their emails is used for this org)
├── role: "admin" | "member" | "contractor"
└── settings: { availability overrides for THIS org }
```

---

## Billing: Simple, No Free Rides

| Scenario | Who Pays |
|----------|----------|
| You're employee at Org A | Org A pays for seat |
| You're contractor at Org B | Org B pays for seat |
| You want your own presence | You pay solo $4/mo |
| You're in 3 orgs + solo | 4 seats paid total |

Each org pays for the seats THEY want. No "bring your own subscription" complexity.

---

## Contractor vs Paid User

**Contractor (in org, no personal sub):**
- Can set availability FOR THAT ORG (e.g., "only Fridays for Aprio")
- NO vanity URL (`/david-kelso` doesn't work)
- MUST use org context (`/david-kelso/aprio`)
- No personal branding
- Exists within org's system only

**Paid solo/org owner:**
- Gets `/david-kelso` vanity URL
- Personal settings, branding, custom everything
- CAN also be contractor in other orgs
- Full control

---

## URL Structure (Currently Inverted)

Current structure: `book.snivel.app/[user]/[org]`

Examples:
- `/david-kelso/odov` → David's odov calendar
- `/david-kelso/delapcpa` → David's delapcpa calendar
- `/david-kelso` → **Needs primary org selection** (vanity redirect)

### Vanity URL Logic

If user has `hasOwnSubscription: true`:
- `/david-kelso` → redirects to `/david-kelso/[primaryOrgSlug]`
- OR shows a picker if they have multiple orgs?

If user is contractor-only (no sub):
- `/david-kelso` → 404 or "upgrade to get vanity URL"
- Must share `/david-kelso/aprio` explicitly

---

## Open Questions

### 1. Personal Email Calendars

What about gmail/yahoo/outlook personal calendars?

Scenarios:
- User has `david.kelso@gmail.com` as personal calendar
- Wants to include personal availability when booking for work
- Or wants personal calendar to be their "solo" presence

Options:
- Personal email can be "primary" for solo account
- Work email links as additional org membership
- Personal calendar syncs as "busy time" across all contexts?

### 2. Primary Org Selection

If user is in multiple orgs, which one is "primary" for:
- Vanity URL redirect (`/david-kelso` → where?)
- Default settings inheritance
- Branding on shared links

Probably: user picks, can change anytime.

### 3. Signup Flow with Collision

When user enters name that generates existing slug:

```
"david-kelso" already exists.

Is this you?
→ [Yes, verify via david@odov.io]
→ [No, I'm a different David Kelso] → generates david-kelso-2 or david-kelso-delapcpa
```

### 4. Org Slug Auto-Suggestion

Extract from email domain:
- `david@delapcpa.com` → suggest org slug `delapcpa`
- `david@aprio.com` → suggest org slug `aprio`
- `david@gmail.com` → suggest... user's name? Or require custom input?

### 5. Contractor Availability Per-Org

Contractor works for Aprio on Fridays only:
- Org-level availability override: `availableDays: [5]` for Aprio
- Doesn't affect their other orgs or personal calendar
- Stored in `OrgMembership.settings`, not global `User.settings`

---

## Implementation Phases

### Phase 1: Unblock Signup (NOW)
- Auto-suggest org slug from email domain
- Handle slug collision gracefully (append something)
- Don't break existing flow

### Phase 2: Account Linking
- Add `emails[]` to User model
- Signup flow detects collision → verify + link
- Support multiple org memberships

### Phase 3: Contractor Model
- Add `hasOwnSubscription` flag
- Conditional vanity URL access
- Per-org availability overrides

### Phase 4: Personal Calendars
- Figure out gmail/yahoo/outlook integration
- "Personal" as a pseudo-org?
- Busy time aggregation across contexts

---

## Notes

- Current pricing: Solo $4, Team tiers $20-$240, 100+ at $2.40/user
- 30-day trial, 5 users max during trial
- Each seat in each org costs that org
- Contractors are not billing-exempt, just permission-different
