export default function Footer() {
  return (
    <footer className="bg-white px-6 pb-10 pt-16 text-center">
      <p className="text-lg font-black tracking-tight text-brand-brown">
        gramweb
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
        {[
          { label: "Examples", href: "#examples" },
          { label: "How it works", href: "#how-it-works" },
          { label: "Pricing", href: "#" },
          { label: "Terms", href: "#" },
          { label: "Privacy", href: "#" },
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm text-gray-400 transition-colors hover:text-brand-brown"
          >
            {link.label}
          </a>
        ))}
      </div>

      <p className="mt-8 text-xs text-gray-300">
        &copy; 2026 GramWeb. All rights reserved.
      </p>
    </footer>
  );
}
