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
