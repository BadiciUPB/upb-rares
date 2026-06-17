"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { universityCenters } from "@/data/mock/university-centers";
import { PcbBoard } from "@/components/home2/pcb-board";
import { useHome2Scroll } from "@/components/home2/use-home2-scroll";
import type { Announcement, Event, Stat } from "@/types/content";

type Home2ExperienceProps = {
  events: Event[];
  announcements: Announcement[];
  stats: Stat[];
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function SlideShell({
  children,
  index,
  activeIndex,
}: {
  children: React.ReactNode;
  index: number;
  activeIndex: number;
}) {
  const isActive = index === activeIndex;
  return (
    <section className="relative flex min-h-[100dvh] snap-start snap-always items-center justify-center px-6 py-24 md:px-10">
      <div
        className={cn(
          "relative z-10 w-full max-w-6xl rounded-3xl border border-white/20 bg-[#081525]/72 p-8 shadow-2xl backdrop-blur-lg transition-all duration-400 md:p-12",
          isActive ? "scale-100 opacity-100" : "scale-[0.98] opacity-75",
        )}
      >
        {children}
      </div>
    </section>
  );
}

export function Home2Experience({ events, announcements, stats }: Home2ExperienceProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const { activeIndex } = useHome2Scroll(scrollerRef);

  const visibleEvents = useMemo(() => events.slice(0, 3), [events]);
  const visibleAnnouncements = useMemo(() => announcements.slice(0, 4), [announcements]);
  const visibleStats = useMemo(() => stats.slice(0, 4), [stats]);

  useEffect(() => {
    document.documentElement.classList.add("home2-active");
    document.body.classList.add("home2-active");
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.classList.remove("home2-active");
      document.body.classList.remove("home2-active");
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  return (
    <>
      <PcbBoard scrollerRef={scrollerRef} />

      <main
        id="main-content"
        ref={scrollerRef}
        className="home2-scroller relative z-10 h-[100dvh] snap-y snap-mandatory overflow-y-auto overscroll-none bg-transparent"
        style={{ scrollBehavior: "auto" }}
      >
        <SlideShell index={0} activeIndex={activeIndex}>
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <div className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                Universitate Națională de Știință și Tehnică
              </div>
              <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-6xl">
                Viitorul ingineriei începe aici
              </h1>
              <p className="mt-4 max-w-xl text-lg text-white/70">
                UNST Politehnica București — peste 200 de ani de tradiție, inovație și excelență academică.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/centre-universitar/bucuresti" className={buttonVariants({ variant: "primary", size: "md" })}>
                  Centrul Universitar București
                </Link>
                <Link
                  href="/centre-universitar/pitesti"
                  className={cn(buttonVariants({ variant: "secondary", size: "md" }), "text-white")}
                >
                  Centrul Universitar Pitești
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-64 w-64 rounded-full border border-cyan-300/35 bg-cyan-400/10 p-6 md:h-80 md:w-80">
                <Image src="/images/logo_alb.svg" alt="Logo UNST Politehnica București" fill className="object-contain p-10" priority />
              </div>
            </div>
          </div>
        </SlideShell>

        <SlideShell index={1} activeIndex={activeIndex}>
          <h2 className="text-3xl font-black text-white md:text-5xl">Centre universitare</h2>
          <p className="mt-3 text-white/65">Alege București sau Pitești și explorează oferta academică.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link href="/centre-universitar/bucuresti" className="rounded-2xl border border-white/15 bg-white/5 p-6 transition hover:bg-white/10">
              <p className="text-sm uppercase tracking-wider text-cyan-200/80">Centrul Universitar</p>
              <h3 className="mt-2 text-3xl font-black text-white">București</h3>
              <p className="mt-3 text-white/65">{universityCenters.bucuresti.heroSubtitle}</p>
            </Link>
            <Link href="/centre-universitar/pitesti" className="rounded-2xl border border-white/15 bg-white/5 p-6 transition hover:bg-white/10">
              <p className="text-sm uppercase tracking-wider text-cyan-200/80">Centrul Universitar</p>
              <h3 className="mt-2 text-3xl font-black text-white">Pitești</h3>
              <p className="mt-3 text-white/65">{universityCenters.pitesti.heroSubtitle}</p>
            </Link>
          </div>
        </SlideShell>

        <SlideShell index={2} activeIndex={activeIndex}>
          <h2 className="text-3xl font-black text-white md:text-5xl">Evenimente</h2>
          <p className="mt-3 text-white/65">Conferințe, workshopuri și întâlniri pentru comunitatea academică.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {visibleEvents.map((event) => (
              <a
                key={event.id}
                href={siteConfig.links.events}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:bg-white/10"
              >
                <p className="text-sm font-semibold text-cyan-200">{formatDate(event.startDate)}</p>
                <h3 className="mt-2 text-lg font-bold text-white">{event.title}</h3>
                <p className="mt-2 text-sm text-white/60">{event.location}</p>
              </a>
            ))}
          </div>
        </SlideShell>

        <SlideShell index={3} activeIndex={activeIndex}>
          <h2 className="text-3xl font-black text-white md:text-5xl">Buletin informativ</h2>
          <p className="mt-3 text-white/65">Ultimele anunțuri pentru studenți și comunitatea universității.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {visibleAnnouncements.map((item) => (
              <a key={item.id} href="#anunturi" className="rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:bg-white/10">
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-white/60">{item.excerpt}</p>
              </a>
            ))}
          </div>
        </SlideShell>

        <SlideShell index={4} activeIndex={activeIndex}>
          <h2 className="text-3xl font-black text-white md:text-5xl">UNST Politehnica în cifre</h2>
          <p className="mt-3 text-white/65">Impact academic, cercetare și inovație la nivel național și european.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {visibleStats.map((stat) => (
              <div key={stat.id} className="rounded-2xl border border-white/15 bg-white/5 p-5 text-center">
                <p className="text-3xl font-black text-white">
                  {stat.value}
                  {stat.suffix ?? ""}
                </p>
                <p className="mt-2 text-sm text-white/65">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://admitere.upb.ro"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "primary", size: "md" })}
            >
              Admitere
            </a>
            <Link href="/" className={cn(buttonVariants({ variant: "secondary", size: "md" }), "text-white")}>
              Înapoi la homepage
            </Link>
          </div>
        </SlideShell>
      </main>
    </>
  );
}
