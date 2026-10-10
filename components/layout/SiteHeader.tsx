"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navItems, site } from "@/data/site-content";
import { Wordmark } from "@/components/ui/Logo";

const lastId = navItems[navItems.length - 1].id;

export function SiteHeader() {
  const [active, setActive] = useState(navItems[0].id);
  const [open, setOpen] = useState(false);

  // Active section: the section crossing a band ~35% down the viewport.
  // Once the footer is visible, the last section is treated as active.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((s) => sectionObserver.observe(s));

    const footer = document.getElementById("site-footer");
    const footerObserver = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) setActive(lastId);
    });
    if (footer) footerObserver.observe(footer);

    return () => {
      sectionObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const media = window.matchMedia("(min-width: 1024px)");
    const onMedia = () => media.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    media.addEventListener("change", onMedia);
    return () => {
      window.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onMedia);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-on-accent"
      >
        Skip to content
      </a>
      <div className="page-x flex h-16 items-center justify-between gap-6">
        <a href="#home" className="rounded-lg" aria-label="Explic, back to top" onClick={() => setOpen(false)}>
          <Wordmark />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative flex h-16 items-center px-3 text-sm transition-colors duration-200 ${
                      isActive ? "font-medium text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-accent transition-opacity duration-200 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={site.appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden h-9 items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-on-accent transition-colors duration-200 hover:bg-accent-strong sm:inline-flex"
          >
            {site.appCtaLabel}
            <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line-strong text-fg transition-colors hover:border-accent lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" strokeWidth={1.5} aria-hidden /> : <Menu className="size-5" strokeWidth={1.5} aria-hidden />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary mobile"
        hidden={!open}
        className="page-x max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-bg pb-6 lg:hidden"
      >
        <ul className="py-2">
          {navItems.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "location" : undefined}
                  className={`flex items-center justify-between rounded-lg py-3.5 text-lg ${
                    isActive ? "font-medium text-accent-text" : "text-fg"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        <a
          href={site.appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-on-accent sm:hidden"
        >
          {site.appCtaLabel}
          <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </nav>
    </header>
  );
}
