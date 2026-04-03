"use client";

import AnimateIn from "@/components/AnimateIn";

export default function BottomCta() {
  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="bg-white px-6 py-20">
      <AnimateIn>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[32px] bg-brand-brown px-8 py-16 text-center md:px-16 md:py-24">
          {/* Subtle radial glow */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(250,204,21,0.6) 0%, transparent 70%)",
            }}
          />

          <h2 className="relative text-3xl font-extrabold text-white md:text-4xl">
            Ready to try?
          </h2>
          <p className="relative mx-auto mt-4 max-w-sm text-white/50">
            20 seconds. Completely free. No account needed.
          </p>
          <button
            onClick={handleClick}
            className="relative mt-8 rounded-full bg-brand-yellow px-8 py-3.5 text-sm font-bold text-brand-brown transition-all hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Get your site
          </button>
        </div>
      </AnimateIn>
    </section>
  );
}
