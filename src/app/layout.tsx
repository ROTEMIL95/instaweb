import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://gramweb.app"),
  title: {
    template: "%s | GramWeb",
    default: "GramWeb — Your Instagram. Now a Website.",
  },
  description:
    "Turn your Instagram page into a beautiful website in seconds. Free, no signup needed. Just paste your username.",
  keywords: [
    "instagram website builder",
    "instagram to website",
    "link in bio",
    "instagram page website",
    "free website from instagram",
  ],
  openGraph: {
    title: "GramWeb — Your Instagram. Now a Website.",
    description:
      "Turn your Instagram page into a beautiful website in seconds. Free, no signup needed. Just paste your username.",
    siteName: "GramWeb",
    type: "website",
    url: "https://gramweb.app",
    images: [{ url: "/og-image.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GramWeb — Your Instagram. Now a Website.",
    description:
      "Turn your Instagram page into a beautiful website in seconds. Free, no signup needed. Just paste your username.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
