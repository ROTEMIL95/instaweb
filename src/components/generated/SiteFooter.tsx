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
