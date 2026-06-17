"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { universityCenters } from "@/data/mock/university-centers";
import type { Announcement, Event, Stat } from "@/types/content";

type Home3ExperienceProps = {
  events: Event[];
  announcements: Announcement[];
  stats: Stat[];
};

const TUNNEL_CARD_COUNT = 4;
const CARD_ANCHORS: number[] = [0, 0.33, 0.66, 1];

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function DepthCard({
  progress,
  anchor,
  children,
}: {
  progress: number;
  anchor: number;
  children: React.ReactNode;
}) {
  const delta = progress - anchor;
  const z = delta * 2200;
  const y = delta * 160;
  const opacity = clamp01(1 - Math.abs(delta) * 5.2) * (delta > 0.25 ? 0 : 1);
  const blur = Math.min(14, Math.abs(delta) * 36);
  const scale = 1 + z / 7000;

  return (
    <div
      className="absolute left-1/2 top-1/2 w-full max-w-6xl px-6 md:px-10"
      style={{
        transform: `translate(-50%, -50%) translateY(${y}px) translateZ(${z}px) scale(${scale})`,
        opacity,
        filter: `blur(${blur}px)`,
        willChange: "transform, opacity, filter",
        pointerEvents: opacity > 0.45 ? "auto" : "none",
      }}
    >
      <div className="rounded-3xl border border-white/28 bg-[#081525]/90 p-8 shadow-2xl backdrop-blur-lg md:p-12">
        {children}
      </div>
    </div>
  );
}

export function Home3Experience({ events, announcements, stats }: Home3ExperienceProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [progress, setProgress] = useState(CARD_ANCHORS[0]);
  const [stepIndex, setStepIndex] = useState(0);

  const targetProgressRef = useRef<number>(CARD_ANCHORS[0]);
  const smoothRef = useRef<number>(CARD_ANCHORS[0]);
  const durationRef = useRef(0);
  const stepIndexRef = useRef(0);
  const wheelLockRef = useRef(false);
  const videoRafRef = useRef<number | null>(null);

  const visibleEvents = useMemo(() => events.slice(0, 3), [events]);
  const visibleAnnouncements = useMemo(() => announcements.slice(0, 4), [announcements]);
  const visibleStats = useMemo(() => stats.slice(0, 4), [stats]);

  useEffect(() => {
    document.documentElement.classList.add("home3-active");
    document.body.classList.add("home3-active");
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.classList.remove("home3-active");
      document.body.classList.remove("home3-active");
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.pause();
    video.currentTime = 0;
    video.load();

    const updateDuration = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
    };

    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("durationchange", updateDuration);
    video.addEventListener("canplay", updateDuration);
    updateDuration();

    return () => {
      if (videoRafRef.current) {
        cancelAnimationFrame(videoRafRef.current);
      }
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("durationchange", updateDuration);
      video.removeEventListener("canplay", updateDuration);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const eased = smoothRef.current + (targetProgressRef.current - smoothRef.current) * 0.14;
      smoothRef.current = Math.abs(eased - targetProgressRef.current) < 0.0002 ? targetProgressRef.current : eased;
      setProgress(smoothRef.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const scrubVideoByImpulse = (direction: 1 | -1) => {
      const video = videoRef.current;
      if (!video) return;

      if (videoRafRef.current) {
        cancelAnimationFrame(videoRafRef.current);
      }

      const rawDuration = durationRef.current || video.duration;
      // If metadata is still pending, still nudge timeline so scrubbing starts immediately.
      if (!Number.isFinite(rawDuration) || rawDuration <= 0) {
        video.currentTime = Math.max(0, video.currentTime + direction * 3);
        return;
      }

      const maxTime = Math.max(0.1, rawDuration - 0.08);
      const from = video.currentTime;
      const to = clamp01((from + direction * 3) / maxTime) * maxTime;
      const start = performance.now();
      const tweenMs = 680;

      const step = (now: number) => {
        const t = clamp01((now - start) / tweenMs);
        const eased = t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
        video.currentTime = from + (to - from) * eased;
        if (t < 1) {
          videoRafRef.current = requestAnimationFrame(step);
        }
      };
      videoRafRef.current = requestAnimationFrame(step);
    };

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 10) return;
      event.preventDefault();

      if (wheelLockRef.current) return;

      const direction: 1 | -1 = event.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(TUNNEL_CARD_COUNT, stepIndexRef.current + direction));
      if (next === stepIndexRef.current) return;

      wheelLockRef.current = true;
      stepIndexRef.current = next;
      setStepIndex(next);

      const tunnelMaxStep = TUNNEL_CARD_COUNT - 1;
      targetProgressRef.current =
        next <= tunnelMaxStep ? CARD_ANCHORS[next] : CARD_ANCHORS[tunnelMaxStep];

      scrubVideoByImpulse(direction);

      const targetEl = stepRefs.current[next];
      if (targetEl) {
        scroller.scrollTo({ top: targetEl.offsetTop, behavior: "smooth" });
      }

      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 700);
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      scroller.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <main
      id="main-content"
      ref={scrollerRef}
      className="home3-scroller relative z-10 h-[100dvh] snap-y snap-mandatory overflow-y-auto overscroll-none bg-transparent"
    >
      <section className="sticky top-0 h-[100dvh] overflow-hidden [perspective:1400px]">
        <video
          ref={videoRef}
          src="/images/home3-tunnel.webm"
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,21,37,0.08),rgba(5,12,22,0.72)_70%)]" />

        <div className="absolute inset-0 [transform-style:preserve-3d]">
          <DepthCard progress={progress} anchor={CARD_ANCHORS[0]}>
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
          </DepthCard>

          <DepthCard progress={progress} anchor={CARD_ANCHORS[1]}>
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
          </DepthCard>

          <DepthCard progress={progress} anchor={CARD_ANCHORS[2]}>
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
          </DepthCard>

          <DepthCard progress={progress} anchor={CARD_ANCHORS[3]}>
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
          </DepthCard>
        </div>
      </section>

      <div className="pointer-events-none">
        {Array.from({ length: TUNNEL_CARD_COUNT }).map((_, i) => (
          <section
            key={i}
            ref={(node) => {
              stepRefs.current[i] = node;
            }}
            className="h-[100dvh] snap-start"
            style={{ minHeight: "100dvh" }}
            aria-hidden="true"
          />
        ))}
      </div>

      <section
        ref={(node) => {
          stepRefs.current[TUNNEL_CARD_COUNT] = node;
        }}
        className="relative z-20 snap-start bg-background px-6 py-24 md:px-10"
      >
        <div className="mx-auto w-full max-w-6xl rounded-3xl border border-slate-200/70 bg-white p-8 text-slate-900 shadow-xl md:p-12 dark:border-white/10 dark:bg-slate-900 dark:text-white">
          <h2 className="text-3xl font-black md:text-5xl">Buletin informativ</h2>
          <p className="mt-3 text-slate-600 dark:text-white/65">Ultimele anunțuri pentru studenți și comunitatea universității.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {visibleAnnouncements.map((item) => (
              <a
                key={item.id}
                href="#anunturi"
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-white/60">{item.excerpt}</p>
              </a>
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
        </div>
      </section>
    </main>
  );
}
