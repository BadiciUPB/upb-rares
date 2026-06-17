"use client";

import { Link } from "@/i18n/routing";
import { buttonVariants } from "@/components/ui/button";
import { GlassPanel } from "@/components/home/ui/glass-panel";
import { OverlaySection } from "@/components/home/OverlaySection";
import { cameraStops } from "@/components/home/camera-stops";
import { cn } from "@/lib/utils";

const heroRange = cameraStops.find((s) => s.id === "hero")!.overlayRange;

export function HeroOverlay({
  forceVisible = false,
  layerIndex = 0,
}: {
  forceVisible?: boolean;
  layerIndex?: number;
}) {
  return (
    <OverlaySection range={heroRange} layerIndex={layerIndex} forceVisible={forceVisible}>
      <div className="mx-auto w-full max-w-5xl">
        <GlassPanel className="border-cyan-400/20">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
            UNST Politehnica București
          </p>
          <h1 className="mt-4 text-3xl font-black leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Universitatea Națională de Știință și Tehnologie{" "}
            <span className="text-gradient">POLITEHNICA București</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70 md:text-xl">
            Educație, cercetare și inovație pentru viitor.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://admitere.upb.ro"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "primary", size: "md" }))}
            >
              Admitere
            </a>
            <Link
              href="/centre-universitar/bucuresti"
              className={cn(buttonVariants({ variant: "secondary", size: "md" }), "text-white")}
            >
              Programe de studii
            </Link>
            <a
              href="#"
              className={cn(buttonVariants({ variant: "outline", size: "md" }), "text-white")}
            >
              Cercetare
            </a>
          </div>
        </GlassPanel>
      </div>
    </OverlaySection>
  );
}
