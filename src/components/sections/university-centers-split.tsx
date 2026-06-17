"use client";

import type { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { universityCenters } from "@/data/mock/university-centers";
import { cn } from "@/lib/utils";

function CenterPanel({
  href,
  city,
  centerName,
  subtitle,
  facultyCount,
  exploreLabel,
  clipClass,
  accentGradient,
  graphic,
}: {
  href: "/centre-universitar/bucuresti" | "/centre-universitar/pitesti";
  city: string;
  centerName: string;
  subtitle: string;
  facultyCount: number;
  exploreLabel: string;
  clipClass: string;
  accentGradient: string;
  graphic: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative z-0 flex min-h-[22rem] flex-1 overflow-hidden outline-none md:min-h-[28rem]",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1a33]",
        clipClass,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 origin-center transition-transform duration-700 ease-out will-change-transform",
          "group-hover:scale-110",
        )}
      >
        <div className={cn("absolute inset-0", accentGradient)} aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(147, 197, 253, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 197, 253, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 transition-opacity duration-500 group-hover:opacity-35"
          aria-hidden="true"
        >
          {graphic}
        </div>

        <div className="relative z-10 flex h-full min-h-[22rem] flex-col items-center justify-center p-8 text-center md:min-h-[28rem] md:p-12 lg:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            {centerName}
          </p>
          <h3 className="mt-2 text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
            {city}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65 md:text-base">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
              {facultyCount} facultăți
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent-cyan">
              {exploreLabel}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function BucharestGraphic() {
  return (
    <svg width="280" height="280" viewBox="0 0 280 280" fill="none" aria-hidden="true">
      <circle cx="140" cy="140" r="120" stroke="#93c5fd" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="140" cy="140" r="80" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.35" />
      <path
        d="M70 200 L140 60 L210 200 Z"
        stroke="#f8fafc"
        strokeWidth="1.5"
        strokeOpacity="0.25"
        fill="none"
      />
      <rect x="115" y="130" width="50" height="70" stroke="#93c5fd" strokeWidth="1" strokeOpacity="0.3" fill="none" />
    </svg>
  );
}

function PitestiGraphic() {
  return (
    <svg width="280" height="280" viewBox="0 0 280 280" fill="none" aria-hidden="true">
      <rect x="40" y="40" width="200" height="200" rx="8" stroke="#06b6d4" strokeWidth="1" strokeOpacity="0.35" />
      <circle cx="140" cy="140" r="48" stroke="#eed202" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
      <path d="M92 180 Q140 100 188 180" stroke="#f8fafc" strokeWidth="1" strokeOpacity="0.2" fill="none" />
    </svg>
  );
}

function stripCityFromCenterName(name: string, city: string) {
  return name.replace(city, "").replace(/\s+/g, " ").trim() || name;
}

export function UniversityCentersSplit({
  exploreLabel,
}: {
  exploreLabel: string;
}) {
  const buc = universityCenters.bucuresti;
  const pit = universityCenters.pitesti;

  return (
    <div className="relative flex w-full flex-col md:flex-row">
      <CenterPanel
        href="/centre-universitar/bucuresti"
        city="București"
        centerName={stripCityFromCenterName(buc.name, "București")}
        subtitle={buc.heroSubtitle}
        facultyCount={buc.faculties.length}
        exploreLabel={exploreLabel}
        clipClass="md:[clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]"
        accentGradient="bg-gradient-to-br from-[#0a1a33] via-[#132c50] to-[#1e3a6e]"
        graphic={<BucharestGraphic />}
      />
      <CenterPanel
        href="/centre-universitar/pitesti"
        city="Pitești"
        centerName={stripCityFromCenterName(pit.name, "Pitești")}
        subtitle={pit.heroSubtitle}
        facultyCount={pit.faculties.length}
        exploreLabel={exploreLabel}
        clipClass="md:[clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)] md:-ml-[6%]"
        accentGradient="bg-gradient-to-bl from-[#0a1a33] via-[#0f2847] to-[#1a4a6e]"
        graphic={<PitestiGraphic />}
      />
    </div>
  );
}
