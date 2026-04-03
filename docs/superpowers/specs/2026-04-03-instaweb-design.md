# InstaWeb — Product Design Spec

## What is InstaWeb?

A tool that turns any public Instagram page into a beautiful single-page website in 20 seconds. Users paste their Instagram username, and get a shareable website with their photos, bio, and links — no signup, no coding, no design skills.

**Model:** Linktree-style freemium. Free tier generates basic sites, paid tiers add custom domains, editing, analytics.

**MVP Scope:** Generate + View only. No signup, no editing, no payments. Validate the idea first.

---

## User Flow (MVP)

1. User lands on **instaweb.com**
2. Enters `@username` in the hero input
3. Sees a loading screen with progress steps ("Fetching profile... Building site...")
4. Redirected to **instaweb.com/@username** — the generated site
5. Can copy the link and share it

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 14+ (App Router)** | SSR, great DX, Vercel-native |
| Styling | **Tailwind CSS** | Rapid iteration, consistent design system |
| Data fetching | **Apify Instagram Scraper** | $2.30/1K profiles, reliable, maintained |
| Hosting | **Vercel** | Free tier, auto-deploy, perfect for Next.js |
| Database | **None for MVP** | On-demand rendering with ISR caching |
| Font | **Inter** | Clean, professional, web-optimized |

---

## Architecture (MVP)

**On-Demand Rendering with ISR caching:**

```
User enters @username
    → Next.js API route calls Apify
    → Apify returns: profile pic, bio, posts (photos + captions), follower count, external links
    → Next.js renders the generated site page
    → ISR caches the page (revalidate: 24h)
    → Subsequent visits served from cache
```

**Routes:**

| Route | Purpose |
|-------|---------|
| `/` | Homepage — hero, examples, features, CTA |
| `/@[username]` | Generated site for that Instagram user |
| `/api/generate` | API route that calls Apify and triggers page generation |

**No database needed.** ISR handles caching. If cache expires, re-fetches from Apify.

---

## Data from Instagram (via Apify)

For each public profile, we extract:

| Data | Used for |
|------|----------|
| Profile picture | Avatar in hero section |
| Display name | Site title |
| Bio text | Description below name |
| External URL (from bio) | Link button |
| Follower count | Display in meta info |
| Location (if public) | Display in meta info |
| Business category | Can influence layout/colors |
| Latest 6-12 posts (images) | Photo grid |
| Post captions | Alt text for images |

**Cost:** ~$0.003-0.005 per profile scrape.

---

## Design: Our Product (Homepage)

**Style:** Bold, colorful, Linktree-inspired but unique identity.

**Brand colors:**
- Primary: **#facc15** (bright yellow)
- Dark: **#422006** (deep brown)
- Light backgrounds: **#fff**
- Text: **#422006** on yellow, **#1a1a1a** on white

**Typography:** Inter, weights 400-900.

**Homepage structure:**

1. **Sticky nav** — logo left, links + "Get started" pill CTA right, blur backdrop
2. **Hero section** (yellow bg) — large bold title "Your Instagram. Now a Website.", subtitle, pill-shaped input + CTA button, "Free, forever. No signup needed." tag
3. **Scrolling ticker** (white bg) — infinite scroll of user categories: "Photographers · Coffee shops · Personal trainers · Nail artists..."
4. **Examples grid** (yellow bg) — 4 cards with avatar, name, type, "View site →" link. Cards lift on hover with spring animation.
5. **Features section** (white bg, rounded top) — "Simple as that" title, 3 alternating rows (text + phone mockup):
   - "Paste your username"
   - "Your site, built in seconds"
   - "Share it everywhere"
6. **Bottom CTA** (dark brown box) — "Ready to try?" + "Get your site" button
7. **Footer** — logo, links (Examples, How it works, Pricing, Terms, Privacy), copyright

**Animations:**
- Scroll-triggered fade-up on all sections (IntersectionObserver)
- Input lifts on focus (translateY + shadow)
- Cards spring-bounce on hover (cubic-bezier 0.34,1.56,0.64,1)
- Avatars scale on card hover
- Phone mockups rotate to straight on hover
- Ticker infinite scroll (CSS animation)
- Button scale on hover/press

**No emojis or icons.** Typography-driven design throughout.

---

## Design: Generated Sites (User Pages)

**Style:** Minimal & Clean single-page site.

**Layout (top to bottom):**

1. **Hero** — gradient or solid background (colors extracted from user's photos), centered profile pic, display name, bio text, location + follower count
2. **Photo grid** — 6 photos in 3x2 grid, edge-to-edge, minimal gap (2px)
3. **Link buttons** — extracted from bio links, styled as rounded cards on light background
4. **Footer** — "Made with instaweb" (virality engine)

**Color extraction:** Analyze the user's photos to pick a dominant color palette for the hero gradient. This makes each generated site feel unique and personal.

**No emojis.** Clean text labels for links.

---

## Loading Screen

When generating a site for the first time (5-15 seconds):

1. Clean white/yellow page with centered content
2. Progress steps that animate in sequence:
   - "Finding your profile..."
   - "Pulling your photos..."
   - "Building your site..."
3. Smooth transition to the generated page

---

## Pages Summary

| Page | Description |
|------|-------------|
| Homepage (`/`) | Marketing page with hero, examples, features, CTA |
| Generated site (`/@username`) | The user's generated single-page website |
| Loading (in-page state) | Shown while generating for the first time |
| 404 / Not found | When username doesn't exist or is private |

---

## Future (Post-MVP, not in scope now)

- User accounts + dashboard
- Edit site (colors, sections, text)
- Custom domains
- Paid plans (Starter $9, Pro $25)
- Supabase for persistence
- OAuth Instagram connect for auto-sync
- Analytics (visits, clicks)
- SEO optimization
- Newsletter/email collection
- Appointment booking integration

---

## Verification Plan

1. Run `npm run dev` and verify homepage renders correctly
2. Enter a real public Instagram username and verify:
   - Loading screen appears with progress steps
   - Generated site shows correct profile data
   - Photos load in the grid
   - Links are extracted and displayed
3. Visit `/@username` again — should load instantly from cache
4. Test on mobile viewport (375px width)
5. Test with private/non-existent username — should show error state
6. Lighthouse score: target 90+ performance, 90+ accessibility

---

## Reference Files

- Homepage design mockup: `.superpowers/brainstorm/6096-1775163888/content/product-polished.html`
- Linktree reference screenshot: `linktree-reference.png`
- Market research: `.firecrawl/` directory
