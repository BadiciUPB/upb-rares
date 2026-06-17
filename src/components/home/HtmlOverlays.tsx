"use client";

import type { Announcement, Event } from "@/types/content";
import { HeroOverlay } from "@/components/home/sections/HeroOverlay";
import { CampusSplitOverlay } from "@/components/home/sections/CampusSplitOverlay";
import { EventsOverlay } from "@/components/home/sections/EventsOverlay";
import { BulletinOverlay } from "@/components/home/sections/BulletinOverlay";
import { LaptopAdmitereOverlay } from "@/components/home/sections/LaptopAdmitereOverlay";
import { getTransitionVeil } from "@/components/home/scroll-rail";
import { useHomeScroll } from "@/components/home/use-home-scroll";

function TransitionVeil() {
  const offset = useHomeScroll();
  const intensity = getTransitionVeil(offset);

  if (intensity < 0.02) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: intensity * 0.45,
        background:
          "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(147,197,253,0.35) 0%, rgba(6,182,212,0.12) 40%, transparent 70%)",
        mixBlendMode: "screen",
      }}
      aria-hidden="true"
    />
  );
}

export function HtmlOverlays({
  events,
  announcements,
}: {
  events: Event[];
  announcements: Announcement[];
}) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      style={{ perspective: "1100px", perspectiveOrigin: "50% 45%" }}
      aria-live="polite"
    >
      <TransitionVeil />
      <HeroOverlay layerIndex={0} />
      <CampusSplitOverlay layerIndex={1} />
      <EventsOverlay events={events} layerIndex={2} />
      <BulletinOverlay announcements={announcements} layerIndex={3} />
      <LaptopAdmitereOverlay layerIndex={4} />
    </div>
  );
}
