import { LandingNav } from "./landing-nav";
import { Hero } from "./hero";
import { Features } from "./features";
import { Workflow } from "./workflow";
import { Testimonials } from "./testimonials";
import { Pricing } from "./pricing";
import { CTA } from "./cta";
import { Footer } from "./footer";

export default function LandingPage() {
  return (
    <div className="dark bg-gray-950 text-white min-h-screen">
      <LandingNav />
      <Hero />
      <Features />
      <Workflow />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
