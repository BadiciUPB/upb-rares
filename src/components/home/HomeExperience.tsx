"use client";

import type { Announcement, Event } from "@/types/content";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HtmlOverlays } from "@/components/home/HtmlOverlays";
import { HomeExperienceStatic } from "@/components/home/HomeExperienceStatic";
import { homeScrollOffset } from "@/components/home/scroll-store";

const SceneCanvas = dynamic(
  () =>
    import("@/components/home/SceneCanvas").then((m) => m.SceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#020617] via-[#0a1a33] to-[#020617]" />
    ),
  },
);

export function HomeExperience({
  events,
  announcements,
}: {
  events: Event[];
  announcements: Announcement[];
}) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const rail = railRef.current;
      if (!rail) return;
      const rect = rail.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const span = Math.max(1, rect.height - vh);
      const traveled = -rect.top;
      const raw = traveled / span;
      homeScrollOffset.current = Math.min(1, Math.max(0, raw));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (prefersReducedMotion || isMobile) {
    return (
      <HomeExperienceStatic events={events} announcements={announcements} />
    );
  }

  return (
    <div ref={railRef} className="relative min-h-[550vh] bg-[#020617]">
      <SceneCanvas />
      <HtmlOverlays events={events} announcements={announcements} />
    </div>
  );
}
