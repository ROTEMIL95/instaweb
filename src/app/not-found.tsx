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
