import AnimateIn from "@/components/AnimateIn";

const FEATURES = [
  {
    title: "Paste your username",
    description:
      "Just type your Instagram handle. We do the rest -- pulling your photos, bio, and links automatically.",
    bg: "bg-amber-50",
    visual: "input",
  },
  {
    title: "Your site, built in seconds",
    description:
      "We generate a stunning, mobile-friendly website from your content. Profile, photo grid, and link list included.",
    bg: "bg-green-50",
    visual: "profile",
  },
  {
    title: "Share it everywhere",
    description:
      "Get a short link you can drop in your bio, send to clients, or add to your business card.",
    bg: "bg-pink-50",
    visual: "share",
  },
] as const;

function PhoneMockup({
  children,
  bg,
}: {
  children: React.ReactNode;
  bg: string;
}) {
  return (
    <div
      className={`group/phone mx-auto w-full max-w-[260px] -rotate-3 rounded-[28px] ${bg} p-6 shadow-sm transition-all duration-500 hover:rotate-0 hover:scale-105`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div className="overflow-hidden rounded-[20px] bg-white p-4 shadow-inner">
        {children}
      </div>
    </div>
  );
}

function VisualInput() {
  return (
    <PhoneMockup bg="bg-amber-50">
      <div className="space-y-3">
        <div className="h-2 w-16 rounded bg-gray-200" />
        <div className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-2">
          <span className="text-xs text-gray-400">@yourusername</span>
        </div>
        <div className="mx-auto h-7 w-24 rounded-full bg-brand-brown" />
      </div>
    </PhoneMockup>
  );
}

function VisualProfile() {
  return (
    <PhoneMockup bg="bg-green-50">
      <div className="space-y-3">
        <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-br from-green-300 to-green-500" />
        <div className="mx-auto h-2 w-20 rounded bg-gray-200" />
        <div className="grid grid-cols-3 gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded bg-gray-100" />
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="h-5 rounded-full bg-gray-100" />
          <div className="h-5 rounded-full bg-gray-100" />
        </div>
      </div>
    </PhoneMockup>
  );
}

function VisualShare() {
  return (
    <PhoneMockup bg="bg-pink-50">
      <div className="space-y-3">
        <div className="rounded-xl border border-gray-100 p-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-300 to-pink-500" />
            <div className="space-y-1">
              <div className="h-2 w-16 rounded bg-gray-200" />
              <div className="h-1.5 w-10 rounded bg-gray-100" />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 rounded-full bg-brand-brown px-2 py-1.5">
            <span className="text-[9px] font-semibold text-amber-200">
              Copy link
            </span>
          </div>
          <div className="flex-1 rounded-full border border-gray-200 px-2 py-1.5 text-center">
            <span className="text-[9px] font-semibold text-gray-400">QR</span>
          </div>
        </div>
      </div>
    </PhoneMockup>
  );
}

const VISUALS = {
  input: VisualInput,
  profile: VisualProfile,
  share: VisualShare,
} as const;

export default function Features() {
  return (
    <section id="how-it-works" className="rounded-t-[40px] bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <AnimateIn>
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-extrabold text-brand-brown md:text-5xl">
              Simple as that
            </h2>
            <p className="mx-auto mt-4 max-w-md text-brand-brown/50">
              Everything happens automatically. You just paste your username.
            </p>
          </div>
        </AnimateIn>

        <div className="space-y-20 md:space-y-28">
          {FEATURES.map((feature, i) => {
            const Visual = VISUALS[feature.visual];
            const isReversed = i % 2 !== 0;

            return (
              <AnimateIn key={feature.title} delay={i * 100}>
                <div
                  className={`flex flex-col items-center gap-10 md:gap-16 ${
                    isReversed ? "md:flex-row-reverse" : "md:flex-row"
                  }`}
                >
                  <div className="flex-1 space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-brown/30">
                      Step {i + 1}
                    </p>
                    <h3 className="text-2xl font-extrabold text-brand-brown md:text-3xl">
                      {feature.title}
                    </h3>
                    <p className="max-w-sm leading-relaxed text-brand-brown/50">
                      {feature.description}
                    </p>
                  </div>
                  <div className="flex-1">
                    <Visual />
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
