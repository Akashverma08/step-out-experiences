import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { SearchBar } from "@/components/site/SearchBar";
import { Categories } from "@/components/site/Categories";
import { Featured } from "@/components/site/Featured";
import { StatsBand } from "@/components/site/StatsBand";
import { Movement } from "@/components/site/Movement";
import { Testimonials } from "@/components/site/Testimonials";
import { Newsletter } from "@/components/site/Newsletter";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AN Out & About — Step Out. Experience More." },
      { name: "description", content: "Curated workshops, social gatherings & immersive experiences. Step out, meet new people, learn something new, create memories." },
      { property: "og:title", content: "AN Out & About — Step Out. Experience More." },
      { property: "og:description", content: "Discover handpicked workshops and community experiences across India." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <SearchBar />
      <Categories />
      <Featured />
      <StatsBand />
      <Movement />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
}
