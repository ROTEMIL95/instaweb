const CATEGORIES = [
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

function TickerList() {
  return (
    <>
      {CATEGORIES.map((cat, i) => (
        <span key={i} className="flex items-center gap-6">
          <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide opacity-30">
            {cat}
          </span>
          <span className="text-xs opacity-20" aria-hidden="true">
            ·
          </span>
        </span>
      ))}
    </>
  );
}

export default function Ticker() {
  return (
    <div className="overflow-hidden bg-white py-5">
      <div className="animate-ticker flex w-max items-center gap-6">
        <TickerList />
        <TickerList />
      </div>
    </div>
  );
}
