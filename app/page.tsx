import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { Overview } from "@/components/sections/Overview";
import { Domain } from "@/components/sections/Domain";
import { Milestones } from "@/components/sections/Milestones";
import { Documents } from "@/components/sections/Documents";
import { Presentations } from "@/components/sections/Presentations";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    // The whole landing page, header and footer included, lives inside one max-w-7xl frame.
    <div className="mx-auto w-full max-w-7xl xl:border-x xl:border-line">
      <SiteHeader />
      <main id="main">
        <Hero />
        <Overview />
        <Domain />
        <Milestones />
        <Documents />
        <Presentations />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </div>
  );
}
