import Nav from "@/components/homepage/Nav";
import Hero from "@/components/homepage/Hero";
import Ticker from "@/components/homepage/Ticker";
import Examples from "@/components/homepage/Examples";
import Features from "@/components/homepage/Features";
import BottomCta from "@/components/homepage/BottomCta";
import Footer from "@/components/homepage/Footer";

export default function Home() {
  return (
    <main className="bg-brand-yellow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "GramWeb",
            url: "https://gramweb.app",
            description:
              "Turn your Instagram page into a beautiful website in seconds.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://gramweb.app/@{search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <Nav />
      <Hero />
      <Ticker />
      <Examples />
      <Features />
      <BottomCta />
      <Footer />
    </main>
  );
}
