export default function Loading() {
  return (
    <div className="min-h-screen bg-brand-yellow flex items-center justify-center">
      <div className="text-center">
        <div className="text-xl font-black text-brand-brown mb-8">
          gramweb
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
