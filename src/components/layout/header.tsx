"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { ThemeToggle, LocaleSwitcher } from "./theme-locale-controls";
import { SiteLogo } from "./site-logo";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
  { key: "bucharestCenter" as const, href: "/centre-universitar/bucuresti" },
  { key: "pitestiCenter" as const, href: "/centre-universitar/pitesti" },
  { key: "faculties" as const, href: "#facultati" },
  { key: "events" as const, href: "#evenimente" },
  { key: "announcements" as const, href: "#anunturi" },
  { key: "admission" as const, href: "https://admitere.upb.ro" },
];

export function Header() {
  const t = useTranslations("Navigation");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const onHero = !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "nav-glass-solid py-3 shadow-glass" : "bg-transparent py-5",
      )}
    >
      <Container as="nav" aria-label="Navigare principală">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <SiteLogo onHero={onHero} className="h-10 w-10 transition-transform duration-300 group-hover:scale-105" />
            <div className="hidden sm:block">
              <p
                className={cn(
                  "text-sm font-bold leading-tight",
                  onHero ? "text-white" : "text-foreground",
                )}
              >
                UNST Politehnica
              </p>
              <p className={cn("text-xs", onHero ? "text-white/60" : "text-muted")}>
                București
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              item.href.startsWith("/") ? (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    onHero
                      ? "text-white/70 hover:text-white"
                      : "text-foreground/70 hover:text-foreground",
                  )}
                >
                  {t(item.key)}
                </Link>
              ) : (
                <a
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    onHero
                      ? "text-white/70 hover:text-white"
                      : "text-foreground/70 hover:text-foreground",
                  )}
                  {...(item.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {t(item.key)}
                </a>
              )
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LocaleSwitcher className="hidden sm:flex" onHero={onHero} />
            <ThemeToggle onHero={onHero} />
            <button
              className={cn(
                "rounded-xl p-2 lg:hidden",
                onHero ? "bg-white/10 text-white" : "glass",
              )}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Meniu mobil"
              aria-expanded={mobileOpen}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div
            className={cn(
              "mt-4 flex flex-col gap-2 rounded-2xl p-4 lg:hidden",
              onHero ? "bg-white/10 backdrop-blur-md" : "glass",
            )}
          >
            {navItems.map((item) => (
              item.href.startsWith("/") ? (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    onHero
                      ? "text-white/80 hover:bg-white/10"
                      : "text-foreground/80 hover:bg-white/10",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {t(item.key)}
                </Link>
              ) : (
                <a
                  key={item.key}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    onHero
                      ? "text-white/80 hover:bg-white/10"
                      : "text-foreground/80 hover:bg-white/10",
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {t(item.key)}
                </a>
              )
            ))}
            <LocaleSwitcher className="mt-2 sm:hidden" onHero={onHero} />
          </div>
        )}
      </Container>
    </header>
  );
}
