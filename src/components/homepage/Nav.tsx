export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-brand-yellow/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="text-xl font-black tracking-tight text-brand-brown">
          gramweb
        </a>

        <div className="flex items-center gap-6">
          <a
            href="#examples"
            className="hidden text-sm font-semibold text-brand-brown/70 transition-colors hover:text-brand-brown md:block"
          >
            Examples
          </a>
          <a
            href="#how-it-works"
            className="hidden text-sm font-semibold text-brand-brown/70 transition-colors hover:text-brand-brown md:block"
          >
            How it works
          </a>
          <a
            href="#"
            className="rounded-full bg-brand-brown px-5 py-2 text-sm font-semibold text-amber-100 transition-all hover:scale-105 hover:shadow-lg active:scale-95"
          >
            Get started
          </a>
        </div>
      </div>
    </nav>
  );
}
