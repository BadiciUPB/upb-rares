"use client";

import { Link } from "@/i18n/routing";
import { GlassPanel } from "@/components/home/ui/glass-panel";
import { OverlaySection } from "@/components/home/OverlaySection";
import { cameraStops } from "@/components/home/camera-stops";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const range = cameraStops.find((s) => s.id === "admitere-laptop")!.overlayRange;

export function LaptopAdmitereOverlay({
  forceVisible = false,
  layerIndex = 4,
}: {
  forceVisible?: boolean;
  layerIndex?: number;
}) {
  return (
    <OverlaySection
      range={range}
      layerIndex={layerIndex}
      forceVisible={forceVisible}
      className={forceVisible ? undefined : "items-end justify-center pb-16 md:pb-24"}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-8 md:flex-row md:items-end md:justify-end">
        {/* Spacer aligns HTML CTA with the 3D laptop screen area */}
        <div className="hidden flex-1 md:block" aria-hidden="true" />

        <div className="flex w-full max-w-md flex-col items-center gap-6 md:max-w-sm">
          <GlassPanel className="w-full text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/80">
              Destinația finală
            </p>
            <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">
              Admitere 2026
            </h2>
            <p className="mt-3 text-sm text-white/70">
              Alege programul potrivit pentru viitorul tău.
            </p>
            <Link
              href="/admitere"
              className={cn(
                buttonVariants({ variant: "primary", size: "md" }),
                "mt-6 w-full",
              )}
            >
              Mergi la admitere
            </Link>
          </GlassPanel>
        </div>
      </div>
    </OverlaySection>
  );
}
