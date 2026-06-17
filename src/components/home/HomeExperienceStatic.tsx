"use client";

import type { Announcement, Event } from "@/types/content";
import { HeroOverlay } from "@/components/home/sections/HeroOverlay";
import { CampusSplitOverlay } from "@/components/home/sections/CampusSplitOverlay";
import { EventsOverlay } from "@/components/home/sections/EventsOverlay";
import { BulletinOverlay } from "@/components/home/sections/BulletinOverlay";
import { LaptopAdmitereOverlay } from "@/components/home/sections/LaptopAdmitereOverlay";

/** Mobile / reduced-motion fallback — stacked sections, no scroll-driven 3D. */
export function HomeExperienceStatic({
  events,
  announcements,
}: {
  events: Event[];
  announcements: Announcement[];
}) {
  return (
    <div className="relative bg-[#020617]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1a33]/40 via-transparent to-[#0a1a33]/60" />

      <div className="relative flex min-h-screen items-center px-6 pt-24 pb-16 md:px-10">
        <HeroOverlay forceVisible />
      </div>

      <div className="relative flex min-h-screen items-center px-6 py-16 md:px-10">
        <CampusSplitOverlay forceVisible />
      </div>

      <div className="relative flex min-h-screen items-center px-6 py-16 md:px-10">
        <EventsOverlay events={events} forceVisible />
      </div>

      <div className="relative flex min-h-screen items-center px-6 py-16 md:px-10">
        <BulletinOverlay announcements={announcements} forceVisible />
      </div>

      <div className="relative flex min-h-screen items-end px-6 py-16 md:px-10">
        <LaptopAdmitereOverlay forceVisible />
      </div>
    </div>
  );
}
