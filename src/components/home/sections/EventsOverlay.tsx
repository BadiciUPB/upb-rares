"use client";

import type { Event } from "@/types/content";
import { GlassPanel } from "@/components/home/ui/glass-panel";
import { OverlaySection } from "@/components/home/OverlaySection";
import { cameraStops } from "@/components/home/camera-stops";
import { siteConfig } from "@/config/site";

const range = cameraStops.find((s) => s.id === "events")!.overlayRange;

const fallbackEvents = [
  {
    id: "1",
    title: "Conferință de cercetare",
    date: "12 oct. 2026",
    href: siteConfig.links.events,
  },
  {
    id: "2",
    title: "Ziua porților deschise",
    date: "25 apr. 2026",
    href: siteConfig.links.events,
  },
  {
    id: "3",
    title: "Workshop AI & Robotică",
    date: "8 iun. 2026",
    href: siteConfig.links.events,
  },
];

function formatDate(start: string) {
  return new Date(start).toLocaleDateString("ro-RO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function EventsOverlay({
  events,
  forceVisible = false,
  layerIndex = 2,
}: {
  events: Event[];
  forceVisible?: boolean;
  layerIndex?: number;
}) {
  const cards =
    events.length > 0
      ? events.slice(0, 4).map((e) => ({
          id: e.id,
          title: e.title,
          date: formatDate(e.startDate),
          href: siteConfig.links.events,
        }))
      : fallbackEvents;

  return (
    <OverlaySection range={range} layerIndex={layerIndex} forceVisible={forceVisible}>
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-white md:text-5xl">Evenimente</h2>
          <p className="mt-3 text-white/60">
            Panou holografic cu activități, conferințe și întâlniri pentru comunitate.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {cards.map((event) => (
            <a
              key={event.id}
              href={event.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <GlassPanel className="h-full transition-transform duration-400 group-hover:scale-[1.03]">
                <time className="text-xs font-semibold uppercase tracking-wider text-cyan-300/80">
                  {event.date}
                </time>
                <h3 className="mt-3 text-lg font-bold text-white md:text-xl">
                  {event.title}
                </h3>
                <span className="mt-4 inline-flex text-sm font-semibold text-accent-cyan">
                  Detalii →
                </span>
              </GlassPanel>
            </a>
          ))}
        </div>
      </div>
    </OverlaySection>
  );
}
