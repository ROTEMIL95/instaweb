# InstaWeb MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a working MVP where users paste an Instagram username and get a generated single-page website with their photos, bio, and links.

**Architecture:** Next.js App Router with on-demand SSR. Homepage at `/`, generated sites at `/@[username]`. Apify Instagram Scraper fetches public profile data. ISR caching (24h revalidate) avoids re-scraping. No database.

**Tech Stack:** Next.js 14+ (App Router), Tailwind CSS, TypeScript, Apify API, Vercel, Inter font

---

## File Structure

```
instaweb/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout: Inter font, global meta
│   │   ├── page.tsx                # Homepage
│   │   ├── globals.css             # Tailwind directives + ticker animation
│   │   ├── @[username]/
│   │   │   ├── page.tsx            # Generated site page (SSR + ISR)
│   │   │   └── loading.tsx         # Loading UI while generating
│   │   ├── not-found.tsx           # 404 page
│   │   └── api/
│   │       └── generate/
│   │           └── route.ts        # API: calls Apify, returns profile data
│   ├── components/
│   │   ├── homepage/
│   │   │   ├── Nav.tsx             # Sticky nav with blur backdrop
│   │   │   ├── Hero.tsx            # Hero section with input
│   │   │   ├── Ticker.tsx          # Scrolling categories ticker
│   │   │   ├── Examples.tsx        # Example cards grid
│   │   │   ├── Features.tsx        # 3 alternating feature rows
│   │   │   ├── BottomCta.tsx       # Dark CTA box
│   │   │   └── Footer.tsx          # Footer with links
│   │   ├── generated/
│   │   │   ├── ProfileHero.tsx     # Avatar + name + bio
│   │   │   ├── PhotoGrid.tsx       # 3x2 photo grid
│   │   │   ├── LinkButtons.tsx     # Extracted link buttons
│   │   │   └── SiteFooter.tsx      # "Made with instaweb"
│   │   └── AnimateIn.tsx           # Scroll-triggered animation wrapper
│   ├── lib/
│   │   ├── apify.ts               # Apify API client
│   │   ├── types.ts               # TypeScript types for Instagram data
│   │   └── colors.ts              # Extract dominant color from image URL
│   └── __tests__/
│       ├── lib/
│       │   ├── apify.test.ts      # Apify client tests
│       │   └── colors.test.ts     # Color extraction tests
│       └── components/
│           └── generated.test.tsx  # Generated site component tests
├── public/
│   └── fonts/                     # Inter font files (optional, can use Google Fonts)
├── .env.local                     # APIFY_API_TOKEN
├── .env.example                   # Template for env vars
├── next.config.ts                 # Next.js config (image domains)
├── tailwind.config.ts             # Tailwind config (brand colors, Inter)
├── tsconfig.json                  # TypeScript config
└── package.json
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: entire project via `create-next-app`
- Modify: `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/globals.css`
- Create: `.env.example`, `.gitignore`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd "c:/Users/rotem/OneDrive/מסמכים/instaweb"
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Answer prompts: Yes to all defaults.

- [ ] **Step 2: Configure Tailwind with brand colors and Inter font**

Replace `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#facc15",
          brown: "#422006",
          "brown-light": "#854d0e",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Set up root layout with Inter font and global meta**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InstaWeb — Your Instagram. Now a Website.",
  description:
    "Turn your Instagram page into a beautiful website in 20 seconds. Free, no signup needed.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Set up globals.css with Tailwind directives and ticker animation**

Replace `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@keyframes ticker-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-ticker {
  animation: ticker-scroll 25s linear infinite;
}
```

- [ ] **Step 5: Create .env.example and update .gitignore**

Create `.env.example`:

```
APIFY_API_TOKEN=your_apify_api_token_here
```

Append to `.gitignore`:

```
.env.local
.firecrawl/
.superpowers/
```

- [ ] **Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: Server starts at http://localhost:3000, default Next.js page renders.

- [ ] **Step 7: Initialize git and commit**

```bash
git init
git add -A
git commit -m "chore: scaffold Next.js project with Tailwind and brand config"
```

---

## Task 2: TypeScript Types and Apify Client

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/apify.ts`
- Create: `src/__tests__/lib/apify.test.ts`

- [ ] **Step 1: Define TypeScript types**

Create `src/lib/types.ts`:

```ts
export interface InstagramPost {
  url: string;
  displayUrl: string;
  caption: string | null;
  likesCount: number;
  timestamp: string;
}

export interface InstagramProfile {
  username: string;
  fullName: string;
  biography: string;
  profilePicUrl: string;
  followersCount: number;
  postsCount: number;
  externalUrl: string | null;
  isPrivate: boolean;
  category: string | null;
  locationName: string | null;
  posts: InstagramPost[];
}
```

- [ ] **Step 2: Write failing test for Apify client**

Create `src/__tests__/lib/apify.test.ts`:

```ts
import { transformApifyData } from "@/lib/apify";

const mockApifyResponse = {
  username: "cafe42",
  fullName: "Café 42",
  biography: "Specialty coffee & fresh pastries\nOpen daily 7am–10pm",
  profilePicUrl: "https://example.com/pic.jpg",
  followersCount: 12400,
  postsCount: 847,
  externalUrl: "https://cafe42.com",
  private: false,
  businessCategoryName: "Coffee Shop",
  locationName: "Tel Aviv",
  latestPosts: [
    {
      url: "https://instagram.com/p/abc",
      displayUrl: "https://example.com/photo1.jpg",
      caption: "Best latte in town",
      likesCount: 234,
      timestamp: "2026-03-15T10:00:00.000Z",
    },
    {
      url: "https://instagram.com/p/def",
      displayUrl: "https://example.com/photo2.jpg",
      caption: null,
      likesCount: 189,
      timestamp: "2026-03-14T10:00:00.000Z",
    },
  ],
};

describe("transformApifyData", () => {
  it("transforms Apify response to InstagramProfile", () => {
    const result = transformApifyData(mockApifyResponse);

    expect(result.username).toBe("cafe42");
    expect(result.fullName).toBe("Café 42");
    expect(result.biography).toBe(
      "Specialty coffee & fresh pastries\nOpen daily 7am–10pm"
    );
    expect(result.followersCount).toBe(12400);
    expect(result.externalUrl).toBe("https://cafe42.com");
    expect(result.isPrivate).toBe(false);
    expect(result.category).toBe("Coffee Shop");
    expect(result.locationName).toBe("Tel Aviv");
    expect(result.posts).toHaveLength(2);
    expect(result.posts[0].displayUrl).toBe(
      "https://example.com/photo1.jpg"
    );
  });

  it("handles missing optional fields", () => {
    const minimal = {
      ...mockApifyResponse,
      externalUrl: null,
      businessCategoryName: null,
      locationName: null,
      latestPosts: [],
    };
    const result = transformApifyData(minimal);

    expect(result.externalUrl).toBeNull();
    expect(result.category).toBeNull();
    expect(result.posts).toHaveLength(0);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

```bash
npm test -- --testPathPattern="apify.test" --no-coverage 2>&1 || true
```

If Jest is not configured yet, install it:

```bash
npm install -D jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

Create `jest.config.ts`:

```ts
import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

export default createJestConfig(config);
```

Add to `package.json` scripts: `"test": "jest"`

Then run: `npm test -- --testPathPattern="apify.test"`

Expected: FAIL — `transformApifyData` is not defined.

- [ ] **Step 4: Implement Apify client**

Create `src/lib/apify.ts`:

```ts
import { InstagramProfile, InstagramPost } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformApifyData(data: any): InstagramProfile {
  const posts: InstagramPost[] = (data.latestPosts || [])
    .slice(0, 12)
    .map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (post: any): InstagramPost => ({
        url: post.url,
        displayUrl: post.displayUrl,
        caption: post.caption || null,
        likesCount: post.likesCount || 0,
        timestamp: post.timestamp,
      })
    );

  return {
    username: data.username,
    fullName: data.fullName || data.username,
    biography: data.biography || "",
    profilePicUrl: data.profilePicUrl,
    followersCount: data.followersCount || 0,
    postsCount: data.postsCount || 0,
    externalUrl: data.externalUrl || null,
    isPrivate: data.private || false,
    category: data.businessCategoryName || null,
    locationName: data.locationName || null,
    posts,
  };
}

export async function fetchInstagramProfile(
  username: string
): Promise<InstagramProfile> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) {
    throw new Error("APIFY_API_TOKEN is not configured");
  }

  const cleanUsername = username.replace(/^@/, "");

  const response = await fetch(
    "https://api.apify.com/v2/acts/apify~instagram-profile-scraper/run-sync-get-dataset-items",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        usernames: [cleanUsername],
        resultsLimit: 12,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Apify API error: ${response.status}`);
  }

  const results = await response.json();

  if (!results || results.length === 0) {
    throw new Error(`Profile not found: @${cleanUsername}`);
  }

  const profile = transformApifyData(results[0]);

  if (profile.isPrivate) {
    throw new Error(`Profile @${cleanUsername} is private`);
  }

  return profile;
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
npm test -- --testPathPattern="apify.test"
```

Expected: 2 tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/types.ts src/lib/apify.ts src/__tests__/lib/apify.test.ts jest.config.ts package.json package-lock.json
git commit -m "feat: add Instagram profile types and Apify client with tests"
```

---

## Task 3: API Route

**Files:**
- Create: `src/app/api/generate/route.ts`

- [ ] **Step 1: Create API route**

Create `src/app/api/generate/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { fetchInstagramProfile } from "@/lib/apify";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const profile = await fetchInstagramProfile(username);
    return NextResponse.json(profile);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    if (message.includes("not found")) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (message.includes("private")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }

    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/generate/route.ts
git commit -m "feat: add /api/generate route for Instagram profile fetching"
```

---

## Task 4: AnimateIn Component

**Files:**
- Create: `src/components/AnimateIn.tsx`

- [ ] **Step 1: Create scroll-triggered animation wrapper**

Create `src/components/AnimateIn.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimateIn({
  children,
  className = "",
  delay = 0,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AnimateIn.tsx
git commit -m "feat: add AnimateIn scroll-triggered animation component"
```

---

## Task 5: Homepage Components

**Files:**
- Create: `src/components/homepage/Nav.tsx`
- Create: `src/components/homepage/Hero.tsx`
- Create: `src/components/homepage/Ticker.tsx`
- Create: `src/components/homepage/Examples.tsx`
- Create: `src/components/homepage/Features.tsx`
- Create: `src/components/homepage/BottomCta.tsx`
- Create: `src/components/homepage/Footer.tsx`

- [ ] **Step 1: Create Nav component**

Create `src/components/homepage/Nav.tsx`:

```tsx
import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-brand-yellow/92 backdrop-blur-md border-b border-brand-brown/5">
      <div className="max-w-[1100px] mx-auto flex justify-between items-center px-8 py-3.5">
        <Link href="/" className="text-xl font-black tracking-tight text-brand-brown">
          instaweb
        </Link>
        <div className="flex gap-7 items-center">
          <Link
            href="#examples"
            className="text-sm font-medium text-brand-brown/65 hover:text-brand-brown transition-opacity hidden sm:block"
          >
            Examples
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-brand-brown/65 hover:text-brand-brown transition-opacity hidden sm:block"
          >
            How it works
          </Link>
          <Link
            href="#"
            className="text-sm font-semibold bg-brand-brown text-amber-100 px-5 py-2 rounded-full hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-brown/25 transition-all"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create Hero component**

Create `src/components/homepage/Hero.tsx`:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AnimateIn from "@/components/AnimateIn";

export default function Hero() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = username.trim().replace(/^@/, "");
    if (clean) {
      router.push(`/@${clean}`);
    }
  }

  return (
    <section className="max-w-[760px] mx-auto px-6 pt-24 pb-16 text-center">
      <AnimateIn>
        <h1 className="text-[clamp(2.5rem,6vw,4.2rem)] font-black leading-[1.04] tracking-[-2.5px] text-brand-brown mb-5">
          Your Instagram.
          <br />
          Now a{" "}
          <span className="relative inline-block">
            Website
            <span className="absolute bottom-0.5 -left-1 -right-1 h-3.5 bg-brand-brown/10 rounded -z-10" />
          </span>
          .
        </h1>
      </AnimateIn>

      <AnimateIn delay={100}>
        <p className="text-lg text-brand-brown/60 max-w-[480px] mx-auto mb-10 leading-relaxed">
          Paste your username and get a beautiful, shareable website built
          from your Instagram. Takes 20 seconds.
        </p>
      </AnimateIn>

      <AnimateIn delay={200}>
        <form
          onSubmit={handleSubmit}
          className="flex max-w-[460px] mx-auto bg-white rounded-full p-[5px] shadow-[0_8px_40px_rgba(66,32,6,0.1)] transition-all focus-within:shadow-[0_12px_48px_rgba(66,32,6,0.18)] focus-within:-translate-y-0.5"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="@yourusername"
            className="flex-1 border-none px-5 py-3.5 text-base font-sans text-brand-brown bg-transparent outline-none min-w-0 placeholder:text-[#c9a65c]"
          />
          <button
            type="submit"
            className="bg-brand-brown text-amber-200 rounded-full px-7 py-3.5 text-sm font-bold whitespace-nowrap hover:scale-[1.04] hover:bg-[#2c1503] active:scale-[0.97] transition-transform"
          >
            Get your site
          </button>
        </form>
      </AnimateIn>

      <AnimateIn delay={300}>
        <p className="text-[0.78rem] text-brand-brown/40 mt-5 font-medium">
          Free, forever. No signup needed.
        </p>
      </AnimateIn>
    </section>
  );
}
```

- [ ] **Step 3: Create Ticker component**

Create `src/components/homepage/Ticker.tsx`:

```tsx
const categories = [
  "Photographers",
  "Coffee shops",
  "Personal trainers",
  "Nail artists",
  "Freelancers",
  "Restaurants",
  "Hair stylists",
  "Coaches",
  "Small brands",
  "Tattoo artists",
  "Musicians",
  "Yoga studios",
];

export default function Ticker() {
  const items = [...categories, ...categories];

  return (
    <div className="overflow-hidden py-5 bg-white">
      <div className="flex gap-8 animate-ticker w-max">
        {items.map((cat, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="text-xs font-semibold text-brand-brown/30 uppercase tracking-[1.5px] whitespace-nowrap">
              {cat}
            </span>
            {i < items.length - 1 && (
              <span className="text-brand-brown/15">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create Examples component**

Create `src/components/homepage/Examples.tsx`:

```tsx
import AnimateIn from "@/components/AnimateIn";

const examples = [
  {
    name: "Luna Nails",
    type: "Beauty Studio",
    gradient: "from-red-300 to-rose-600",
    username: "lunanails",
  },
  {
    name: "FitCoach",
    type: "Personal Trainer",
    gradient: "from-green-300 to-green-600",
    username: "fitcoach",
  },
  {
    name: "Café 42",
    type: "Coffee Shop",
    gradient: "from-orange-300 to-orange-600",
    username: "cafe42",
  },
  {
    name: "Studio Lens",
    type: "Photography",
    gradient: "from-violet-300 to-violet-600",
    username: "studiolens",
  },
];

export default function Examples() {
  return (
    <section id="examples" className="max-w-[960px] mx-auto px-6 py-16">
      <div className="text-center text-[0.7rem] uppercase tracking-[3px] font-semibold text-brand-brown/35 mb-8">
        See what your Instagram could become
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {examples.map((ex, i) => (
          <AnimateIn key={ex.username} delay={i * 100}>
            <div className="bg-white rounded-2xl p-7 text-center shadow-[0_1px_8px_rgba(66,32,6,0.04)] cursor-pointer hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(66,32,6,0.1)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group">
              <div
                className={`w-[72px] h-[72px] rounded-full bg-gradient-to-br ${ex.gradient} mx-auto mb-4 group-hover:scale-110 transition-transform duration-350 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
              />
              <div className="text-[0.95rem] font-bold text-brand-brown mb-0.5">
                {ex.name}
              </div>
              <div className="text-[0.75rem] text-brand-brown/40 font-medium">
                {ex.type}
              </div>
              <span className="inline-block mt-3 text-[0.7rem] font-semibold text-brand-brown/50 group-hover:text-brand-brown transition-colors">
                View site →
              </span>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create Features component**

Create `src/components/homepage/Features.tsx`:

```tsx
import AnimateIn from "@/components/AnimateIn";

export default function Features() {
  return (
    <section
      id="how-it-works"
      className="bg-white rounded-t-[40px]"
    >
      <div className="max-w-[1000px] mx-auto px-6 py-20">
        <AnimateIn>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-[-1.5px] text-center text-gray-900 mb-4">
            Simple as that
          </h2>
        </AnimateIn>
        <AnimateIn delay={100}>
          <p className="text-center text-base text-gray-400 max-w-[500px] mx-auto mb-16 leading-relaxed">
            Everything happens automatically. You just paste your username.
          </p>
        </AnimateIn>

        {/* Feature 1 */}
        <AnimateIn>
          <div className="flex flex-col md:flex-row gap-12 items-center mb-20">
            <div className="flex-1">
              <h3 className="text-xl font-extrabold tracking-tight text-gray-900 mb-2">
                Paste your username
              </h3>
              <p className="text-[0.95rem] text-gray-400 leading-relaxed">
                Enter your Instagram handle and we do the rest. We pull
                your photos, bio, links, and brand colors — no login, no
                permissions, nothing to set up.
              </p>
            </div>
            <div className="flex-1 bg-amber-50 rounded-3xl min-h-[280px] flex items-center justify-center p-8">
              <div className="w-[200px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                <div className="p-6 text-center">
                  <div className="text-sm font-extrabold text-brand-brown mb-4">
                    instaweb
                  </div>
                  <div className="bg-gray-100 rounded-full px-3 py-2 text-xs text-gray-400 text-left mb-2">
                    @yourusername
                  </div>
                  <div className="bg-brand-brown text-amber-200 rounded-full px-3 py-2 text-xs font-bold text-center">
                    Get your site
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* Feature 2 */}
        <AnimateIn>
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center mb-20">
            <div className="flex-1">
              <h3 className="text-xl font-extrabold tracking-tight text-gray-900 mb-2">
                Your site, built in seconds
              </h3>
              <p className="text-[0.95rem] text-gray-400 leading-relaxed">
                We analyze your content and create a beautiful single-page
                site with your best photos, profile info, and all your
                links. It looks like you hired a designer.
              </p>
            </div>
            <div className="flex-1 bg-green-50 rounded-3xl min-h-[280px] flex items-center justify-center p-8">
              <div className="w-[200px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                <div className="p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-orange-600 mx-auto mb-2" />
                  <div className="text-xs font-bold text-gray-900">
                    Café 42
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    Specialty coffee
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-px">
                  <div className="aspect-square bg-amber-700" />
                  <div className="aspect-square bg-amber-800" />
                  <div className="aspect-square bg-yellow-700" />
                  <div className="aspect-square bg-orange-800" />
                  <div className="aspect-square bg-amber-600" />
                  <div className="aspect-square bg-yellow-800" />
                </div>
                <div className="p-2 space-y-1">
                  <div className="bg-gray-100 rounded-lg px-2 py-1.5 text-[10px] text-gray-500 text-center">
                    Our Menu
                  </div>
                  <div className="bg-gray-100 rounded-lg px-2 py-1.5 text-[10px] text-gray-500 text-center">
                    Find Us
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* Feature 3 */}
        <AnimateIn>
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h3 className="text-xl font-extrabold tracking-tight text-gray-900 mb-2">
                Share it everywhere
              </h3>
              <p className="text-[0.95rem] text-gray-400 leading-relaxed">
                Get a clean link like instaweb.com/@you. Put it in your
                Instagram bio, WhatsApp, business card — anywhere. Your
                visitors see a real website, not just a feed.
              </p>
            </div>
            <div className="flex-1 bg-pink-50 rounded-3xl min-h-[280px] flex items-center justify-center p-8">
              <div className="text-center">
                <div className="bg-white rounded-2xl px-6 py-4 shadow-md inline-block mb-4">
                  <div className="text-[11px] text-gray-400 mb-1">
                    Your link
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    instaweb.com/@cafe42
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <div className="bg-white rounded-xl px-3 py-2 text-[11px] font-semibold text-gray-500 shadow-sm">
                    Copy link
                  </div>
                  <div className="bg-white rounded-xl px-3 py-2 text-[11px] font-semibold text-gray-500 shadow-sm">
                    QR code
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Create BottomCta component**

Create `src/components/homepage/BottomCta.tsx`:

```tsx
import Link from "next/link";
import AnimateIn from "@/components/AnimateIn";

export default function BottomCta() {
  return (
    <section className="bg-white px-6 pb-20">
      <AnimateIn>
        <div className="max-w-[760px] mx-auto bg-brand-brown rounded-[32px] px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-[200px] h-[200px] bg-[radial-gradient(circle,rgba(250,204,21,0.15),transparent_70%)]" />
          <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-white tracking-tight mb-2 relative">
            Ready to try?
          </h2>
          <p className="text-[0.95rem] text-white/50 mb-8 relative">
            20 seconds. Completely free. No account needed.
          </p>
          <Link
            href="#"
            className="inline-block bg-brand-yellow text-brand-brown rounded-full px-10 py-4 text-base font-bold hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(250,204,21,0.3)] transition-all relative"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Get your site
          </Link>
        </div>
      </AnimateIn>
    </section>
  );
}
```

- [ ] **Step 7: Create Footer component**

Create `src/components/homepage/Footer.tsx`:

```tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white py-12 px-6 text-center">
      <div className="max-w-[800px] mx-auto">
        <div className="text-lg font-black text-gray-900 mb-4">
          instaweb
        </div>
        <div className="flex gap-8 justify-center flex-wrap mb-6">
          {["Examples", "How it works", "Pricing", "Terms", "Privacy"].map(
            (label) => (
              <Link
                key={label}
                href="#"
                className="text-[0.8rem] text-gray-400 font-medium hover:text-brand-brown transition-colors"
              >
                {label}
              </Link>
            )
          )}
        </div>
        <div className="text-[0.72rem] text-gray-300">
          &copy; {new Date().getFullYear()} InstaWeb. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add src/components/
git commit -m "feat: add all homepage components — Nav, Hero, Ticker, Examples, Features, BottomCta, Footer"
```

---

## Task 6: Assemble Homepage

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Wire up homepage with all components**

Replace `src/app/page.tsx`:

```tsx
import Nav from "@/components/homepage/Nav";
import Hero from "@/components/homepage/Hero";
import Ticker from "@/components/homepage/Ticker";
import Examples from "@/components/homepage/Examples";
import Features from "@/components/homepage/Features";
import BottomCta from "@/components/homepage/BottomCta";
import Footer from "@/components/homepage/Footer";

export default function Home() {
  return (
    <main className="bg-brand-yellow">
      <Nav />
      <Hero />
      <Ticker />
      <Examples />
      <Features />
      <BottomCta />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 2: Verify homepage renders in browser**

```bash
npm run dev
```

Open http://localhost:3000. Verify:
- Yellow background with sticky nav
- Hero with input field
- Scrolling ticker on white background
- Example cards that bounce on hover
- Features section with phone mockups
- Bottom CTA and footer
- Scroll animations trigger on each section

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble homepage with all sections and scroll animations"
```

---

## Task 7: Color Extraction Utility

**Files:**
- Create: `src/lib/colors.ts`
- Create: `src/__tests__/lib/colors.test.ts`

- [ ] **Step 1: Write failing test for color extraction**

Create `src/__tests__/lib/colors.test.ts`:

```ts
import { generateProfileGradient } from "@/lib/colors";

describe("generateProfileGradient", () => {
  it("returns a valid CSS gradient string", () => {
    const result = generateProfileGradient("cafe42");
    expect(result).toMatch(/^linear-gradient\(/);
  });

  it("returns consistent gradient for same username", () => {
    const a = generateProfileGradient("cafe42");
    const b = generateProfileGradient("cafe42");
    expect(a).toBe(b);
  });

  it("returns different gradients for different usernames", () => {
    const a = generateProfileGradient("cafe42");
    const b = generateProfileGradient("lunanails");
    expect(a).not.toBe(b);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- --testPathPattern="colors.test"
```

Expected: FAIL — `generateProfileGradient` is not defined.

- [ ] **Step 3: Implement color generation**

Create `src/lib/colors.ts`:

```ts
const palettes = [
  { from: "#1a1a2e", to: "#16213e" },
  { from: "#2d1b69", to: "#11998e" },
  { from: "#1a0533", to: "#4c1d95" },
  { from: "#0f3460", to: "#16213e" },
  { from: "#2d1f0e", to: "#3a1f08" },
  { from: "#1a0505", to: "#4c0519" },
  { from: "#020617", to: "#1e40af" },
  { from: "#042f2e", to: "#134e4a" },
  { from: "#1c1917", to: "#44403c" },
  { from: "#172554", to: "#1e3a5f" },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

export function generateProfileGradient(username: string): string {
  const index = hashString(username) % palettes.length;
  const palette = palettes[index];
  return `linear-gradient(135deg, ${palette.from}, ${palette.to})`;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- --testPathPattern="colors.test"
```

Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/colors.ts src/__tests__/lib/colors.test.ts
git commit -m "feat: add deterministic color gradient generation per username"
```

---

## Task 8: Generated Site Components

**Files:**
- Create: `src/components/generated/ProfileHero.tsx`
- Create: `src/components/generated/PhotoGrid.tsx`
- Create: `src/components/generated/LinkButtons.tsx`
- Create: `src/components/generated/SiteFooter.tsx`

- [ ] **Step 1: Create ProfileHero component**

Create `src/components/generated/ProfileHero.tsx`:

```tsx
import Image from "next/image";

interface ProfileHeroProps {
  profilePicUrl: string;
  fullName: string;
  username: string;
  biography: string;
  followersCount: number;
  locationName: string | null;
  gradient: string;
}

export default function ProfileHero({
  profilePicUrl,
  fullName,
  username,
  biography,
  followersCount,
  locationName,
  gradient,
}: ProfileHeroProps) {
  const formattedFollowers =
    followersCount >= 1000
      ? `${(followersCount / 1000).toFixed(1).replace(/\.0$/, "")}K`
      : followersCount.toString();

  return (
    <div className="py-12 px-6 text-center text-white" style={{ background: gradient }}>
      <div className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-white/20 overflow-hidden">
        <Image
          src={profilePicUrl}
          alt={fullName}
          width={80}
          height={80}
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-2xl font-extrabold mb-1">{fullName}</h1>
      <p className="text-sm text-white/60 mb-2">@{username}</p>
      {biography && (
        <p className="text-sm text-white/80 leading-relaxed max-w-[300px] mx-auto mb-3 whitespace-pre-line">
          {biography}
        </p>
      )}
      <p className="text-xs text-white/40">
        {locationName && <span>{locationName} · </span>}
        {formattedFollowers} followers
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Create PhotoGrid component**

Create `src/components/generated/PhotoGrid.tsx`:

```tsx
import Image from "next/image";
import { InstagramPost } from "@/lib/types";

interface PhotoGridProps {
  posts: InstagramPost[];
}

export default function PhotoGrid({ posts }: PhotoGridProps) {
  const displayPosts = posts.slice(0, 6);

  if (displayPosts.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-0.5">
      {displayPosts.map((post, i) => (
        <div key={i} className="aspect-square relative overflow-hidden">
          <Image
            src={post.displayUrl}
            alt={post.caption || `Post ${i + 1}`}
            fill
            className="object-cover"
            sizes="33vw"
          />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create LinkButtons component**

Create `src/components/generated/LinkButtons.tsx`:

```tsx
interface LinkButtonsProps {
  externalUrl: string | null;
  username: string;
}

export default function LinkButtons({
  externalUrl,
  username,
}: LinkButtonsProps) {
  return (
    <div className="p-5 bg-gray-50 space-y-2.5">
      {externalUrl && (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white rounded-xl px-4 py-3.5 text-sm font-medium text-gray-700 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          {new URL(externalUrl).hostname.replace("www.", "")}
        </a>
      )}
      <a
        href={`https://instagram.com/${username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white rounded-xl px-4 py-3.5 text-sm font-medium text-gray-700 text-center shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-md hover:-translate-y-0.5 transition-all"
      >
        Follow on Instagram
      </a>
    </div>
  );
}
```

- [ ] **Step 4: Create SiteFooter component**

Create `src/components/generated/SiteFooter.tsx`:

```tsx
import Link from "next/link";

export default function SiteFooter() {
  return (
    <div className="py-4 text-center bg-gray-50 border-t border-gray-100">
      <Link
        href="/"
        className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
      >
        Made with <span className="font-semibold text-gray-400">instaweb</span>
      </Link>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/generated/
git commit -m "feat: add generated site components — ProfileHero, PhotoGrid, LinkButtons, SiteFooter"
```

---

## Task 9: Generated Site Page

**Files:**
- Create: `src/app/@[username]/page.tsx`
- Create: `src/app/@[username]/loading.tsx`
- Create: `src/app/not-found.tsx`
- Modify: `next.config.ts` (add image domains)

- [ ] **Step 1: Configure Next.js for external images**

Replace `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Create loading state**

Create `src/app/@[username]/loading.tsx`:

```tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-yellow flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl font-black text-brand-brown mb-8">
          instaweb
        </div>
        <div className="space-y-4 max-w-[260px]">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-brand-brown/20 border-t-brand-brown animate-spin" />
            <span className="text-sm text-brand-brown/60">
              Finding your profile...
            </span>
          </div>
          <div className="flex items-center gap-3 opacity-40">
            <div className="w-5 h-5 rounded-full border-2 border-brand-brown/10" />
            <span className="text-sm text-brand-brown/40">
              Pulling your photos...
            </span>
          </div>
          <div className="flex items-center gap-3 opacity-20">
            <div className="w-5 h-5 rounded-full border-2 border-brand-brown/10" />
            <span className="text-sm text-brand-brown/40">
              Building your site...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create generated site page**

Create `src/app/@[username]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { fetchInstagramProfile } from "@/lib/apify";
import { generateProfileGradient } from "@/lib/colors";
import ProfileHero from "@/components/generated/ProfileHero";
import PhotoGrid from "@/components/generated/PhotoGrid";
import LinkButtons from "@/components/generated/LinkButtons";
import SiteFooter from "@/components/generated/SiteFooter";

interface PageProps {
  params: Promise<{ username: string }>;
}

export const revalidate = 86400; // 24 hours ISR

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params;
  const clean = username.replace(/^@/, "");
  return {
    title: `@${clean} — InstaWeb`,
    description: `Check out @${clean}'s website, built from their Instagram.`,
  };
}

export default async function GeneratedSitePage({ params }: PageProps) {
  const { username } = await params;
  const clean = username.replace(/^@/, "");

  let profile;
  try {
    profile = await fetchInstagramProfile(clean);
  } catch {
    notFound();
  }

  const gradient = generateProfileGradient(clean);

  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto shadow-[0_0_40px_rgba(0,0,0,0.08)]">
      <ProfileHero
        profilePicUrl={profile.profilePicUrl}
        fullName={profile.fullName}
        username={profile.username}
        biography={profile.biography}
        followersCount={profile.followersCount}
        locationName={profile.locationName}
        gradient={gradient}
      />
      <PhotoGrid posts={profile.posts} />
      <LinkButtons
        externalUrl={profile.externalUrl}
        username={profile.username}
      />
      <SiteFooter />
    </div>
  );
}
```

- [ ] **Step 4: Create 404 page**

Create `src/app/not-found.tsx`:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-yellow flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-xl font-black text-brand-brown mb-6">
          instaweb
        </div>
        <h1 className="text-3xl font-extrabold text-brand-brown mb-3">
          Profile not found
        </h1>
        <p className="text-brand-brown/60 mb-8 max-w-[360px]">
          This Instagram profile doesn&apos;t exist or is set to private.
          Make sure the username is correct and the profile is public.
        </p>
        <Link
          href="/"
          className="inline-block bg-brand-brown text-amber-200 rounded-full px-8 py-3 font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify build passes**

```bash
npm run build
```

Expected: Build succeeds. The `/@[username]` route uses dynamic rendering.

- [ ] **Step 6: Commit**

```bash
git add src/app/@* src/app/not-found.tsx next.config.ts
git commit -m "feat: add generated site page with ISR, loading state, and 404 page"
```

---

## Task 10: Environment Setup and End-to-End Verification

**Files:**
- Create: `.env.local` (not committed)

- [ ] **Step 1: Set up Apify API token**

Create `.env.local`:

```
APIFY_API_TOKEN=<your-real-token-here>
```

Get your token from https://console.apify.com/account/integrations

- [ ] **Step 2: Start dev server and test full flow**

```bash
npm run dev
```

1. Open http://localhost:3000 — verify homepage renders
2. Enter a real public username (e.g., `@natgeo`) in the input
3. Verify loading state appears
4. Verify generated site renders with real photos and bio
5. Visit the URL directly (e.g., http://localhost:3000/@natgeo)
6. Try a fake username — verify 404 page shows
7. Test on mobile viewport (375px width) in browser devtools

- [ ] **Step 3: Run all tests**

```bash
npm test
```

Expected: All 5 tests pass (2 Apify + 3 colors).

- [ ] **Step 4: Run production build**

```bash
npm run build
```

Expected: Build succeeds with no errors or warnings.

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: finalize MVP — environment config and verification"
```

---

## Verification Checklist

- [ ] Homepage renders with all sections and animations
- [ ] Input accepts username and navigates to `/@username`
- [ ] Loading screen shows while fetching
- [ ] Generated site displays real Instagram data (photos, bio, links)
- [ ] Repeat visits load instantly (ISR cache)
- [ ] Private/missing profiles show 404 page
- [ ] Mobile responsive (375px)
- [ ] All tests pass
- [ ] Production build succeeds
