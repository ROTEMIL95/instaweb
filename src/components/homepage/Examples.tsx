import AnimateIn from "@/components/AnimateIn";

const EXAMPLES = [
  { name: "Luna Nails", type: "Beauty Studio", gradient: "from-red-300 to-rose-600" },
  { name: "FitCoach", type: "Personal Trainer", gradient: "from-green-300 to-green-600" },
  { name: "Cafe 42", type: "Coffee Shop", gradient: "from-orange-300 to-orange-600" },
  { name: "Studio Lens", type: "Photography", gradient: "from-violet-300 to-violet-600" },
];

export default function Examples() {
  return (
    <section id="examples" className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <AnimateIn>
          <p className="mb-12 text-center text-xs font-semibold uppercase tracking-[3px] text-brand-brown/50">
            See what your Instagram could become
          </p>
        </AnimateIn>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {EXAMPLES.map((ex, i) => (
            <AnimateIn key={ex.name} delay={i * 100}>
              <div className="group cursor-pointer rounded-2xl bg-white p-6 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
              >
                <div
                  className={`mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br ${ex.gradient} transition-transform duration-500 group-hover:scale-110`}
                />
                <p className="text-sm font-bold text-brand-brown">{ex.name}</p>
                <p className="mt-0.5 text-xs text-brand-brown/50">{ex.type}</p>
                <p className="mt-3 text-xs font-semibold text-brand-brown/0 transition-all duration-300 group-hover:text-brand-brown/60">
                  View site &rarr;
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
