import { ArrowDown, ArrowUpRight } from "lucide-react";
import { hero, site } from "@/data/site-content";
import { isValidResourceUrl } from "@/data/research-documents";
import { ButtonLink } from "@/components/ui/Button";
import { HeroBackground } from "@/components/hero/HeroBackground";
import { HeroVideo } from "@/components/hero/HeroVideo";

const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

export function Hero() {
  const { figure, video } = hero;
  // Checked at build time: an invalid URL renders the fallback figure instead of a blank frame.
  const videoSrc = isValidResourceUrl(video.src) ? video.src : null;
  const poster = isValidResourceUrl(video.poster) ? video.poster : undefined;
  const [titleLead, titleRest] = site.fullTitle.split(hero.titleHighlight);

  return (
    // Layers, by source order and no z-index: 1. section surface, 2. slats, 3. content.
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden">
      <HeroBackground />
      <div className="page-x relative pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pt-20">
        <p className="hero-in font-mono text-[13px] text-accent-text" style={stagger(0)}>
          {hero.eyebrow}
        </p>

        <h1
          id="hero-title"
          className="hero-in mt-5 max-w-5xl text-balance wrap-break-word text-[1.875rem] font-medium leading-[1.1] text-fg sm:text-5xl lg:text-[3.5rem]"
          style={stagger(1)}
        >
          {titleRest === undefined ? (
            site.fullTitle
          ) : (
            <>
              {titleLead}
              <span className="text-accent-text">{hero.titleHighlight}</span>
              {titleRest}
            </>
          )}
        </h1>

        <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-5">
            <p className="hero-in max-w-[44ch] text-lg leading-relaxed text-muted" style={stagger(2)}>
              {hero.description}
            </p>
            <div className="hero-in mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" style={stagger(3)}>
              <ButtonLink href="#domain" variant="primary">
                Explore the research
                <ArrowDown className="size-4 transition-transform duration-200 group-hover:translate-y-0.5" strokeWidth={1.5} aria-hidden />
              </ButtonLink>
              <ButtonLink href={site.appUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
                {site.appCtaLabel}
                <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </ButtonLink>
            </div>
          </div>

          <figure className="hero-in lg:col-span-7" style={stagger(3)}>
            <HeroVideo src={videoSrc} poster={poster} label={video.label} caption={video.caption} fallback={figure} />
          </figure>
        </div>
      </div>
    </section>
  );
}
