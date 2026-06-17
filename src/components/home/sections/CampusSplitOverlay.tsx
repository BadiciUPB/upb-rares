"use client";

import { Link } from "@/i18n/routing";
import { GlassPanel } from "@/components/home/ui/glass-panel";
import { OverlaySection } from "@/components/home/OverlaySection";
import { cameraStops } from "@/components/home/camera-stops";
import { cn } from "@/lib/utils";

const range = cameraStops.find((s) => s.id === "campuses")!.overlayRange;

const campusCards = [
  { label: "Facultăți", href: "/centre-universitar/bucuresti" as const },
  { label: "Admitere", href: "https://admitere.upb.ro" },
  { label: "Campus", href: "#" },
  { label: "Contact", href: "mailto:rectorat@upb.ro" },
];

function CampusColumn({
  city,
  subtitle,
  baseHref,
  accent,
}: {
  city: string;
  subtitle: string;
  baseHref: "/centre-universitar/bucuresti" | "/centre-universitar/pitesti";
  accent: string;
}) {
  return (
    <GlassPanel className={cn("flex-1 transition-transform duration-500 hover:scale-[1.02]", accent)}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
        Centrul Universitar
      </p>
      <h2 className="mt-2 text-4xl font-black text-white md:text-5xl">{city}</h2>
      <p className="mt-3 text-sm text-white/65 md:text-base">{subtitle}</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {campusCards.map((card) => {
          const href =
            card.label === "Facultăți"
              ? baseHref
              : card.href;

          const className =
            "rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/90 transition hover:border-cyan-400/40 hover:bg-white/10";

          return href.startsWith("http") || href.startsWith("mailto") ? (
            <a
              key={card.label}
              href={href}
              className={className}
              {...(href.startsWith("http")
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {card.label}
            </a>
          ) : (
            <Link key={card.label} href={href as "/centre-universitar/bucuresti" | "/centre-universitar/pitesti"} className={className}>
              {card.label}
            </Link>
          );
        })}
      </div>
    </GlassPanel>
  );
}

export function CampusSplitOverlay({
  forceVisible = false,
  layerIndex = 1,
}: {
  forceVisible?: boolean;
  layerIndex?: number;
}) {
  return (
    <OverlaySection range={range} layerIndex={layerIndex} align="split" forceVisible={forceVisible}>
      <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-2 md:gap-8">
        <CampusColumn
          city="București"
          subtitle="Cel mai mare centru academic — inginerie, cercetare și inovație la scară națională."
          baseHref="/centre-universitar/bucuresti"
          accent="border-blue-400/20"
        />
        <CampusColumn
          city="Pitești"
          subtitle="Un centru conectat, orientat spre carieră, cu programe moderne și comunitate activă."
          baseHref="/centre-universitar/pitesti"
          accent="border-cyan-400/20"
        />
      </div>
    </OverlaySection>
  );
}
