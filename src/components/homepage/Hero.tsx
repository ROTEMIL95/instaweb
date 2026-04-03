"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AnimateIn from "@/components/AnimateIn";

export default function Hero() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = username.replace(/^@/, "").trim();
    if (clean) {
      router.push(`/@${clean}`);
    }
  }

  return (
    <section className="flex flex-col items-center px-6 pb-20 pt-24 text-center md:pt-32">
      <div className="mx-auto max-w-[760px]">
        <AnimateIn>
          <h1
            className="font-black text-brand-brown"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              lineHeight: 1.05,
            }}
          >
            Your Instagram.
            <br />
            Now a{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Website.</span>
              <span className="absolute bottom-1 left-0 -z-0 h-[35%] w-full rounded bg-brand-brown/10" />
            </span>
          </h1>
        </AnimateIn>

        <AnimateIn delay={100}>
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-brand-brown/60">
            Paste your username and get a beautiful, shareable website built from
            your Instagram. Takes 20 seconds.
          </p>
        </AnimateIn>

        <AnimateIn delay={200}>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 flex max-w-md items-center gap-2 rounded-full bg-white p-2 shadow-md transition-all duration-300 focus-within:-translate-y-0.5 focus-within:shadow-xl"
          >
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="@yourusername"
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-brand-brown outline-none placeholder:text-brand-brown/30"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brand-brown px-6 py-2.5 text-sm font-semibold text-amber-200 transition-all hover:scale-105 active:scale-95"
            >
              Get your site
            </button>
          </form>
        </AnimateIn>

        <AnimateIn delay={300}>
          <p className="mt-4 text-xs font-medium tracking-wide text-brand-brown/40">
            Free, forever. No signup needed.
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
