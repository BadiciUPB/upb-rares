"use client";

import type { Announcement } from "@/types/content";
import { GlassPanel } from "@/components/home/ui/glass-panel";
import { OverlaySection } from "@/components/home/OverlaySection";
import { cameraStops } from "@/components/home/camera-stops";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const range = cameraStops.find((s) => s.id === "bulletin")!.overlayRange;

const fallbackBulletins = [
  { id: "1", title: "Calendar academic", excerpt: "Termene, sesiuni și perioade de examinare." },
  { id: "2", title: "Anunțuri administrative", excerpt: "Informații oficiale pentru studenți și cadre didactice." },
  { id: "3", title: "Burse și mobilități", excerpt: "Oportunități Erasmus+ și programe de finanțare." },
  { id: "4", title: "Noutăți pentru studenți", excerpt: "Actualizări din viața universitară." },
];

export function BulletinOverlay({
  announcements,
  forceVisible = false,
  layerIndex = 3,
}: {
  announcements: Announcement[];
  forceVisible?: boolean;
  layerIndex?: number;
}) {
  const items =
    announcements.length > 0
      ? announcements.slice(0, 4).map((a) => ({
          id: a.id,
          title: a.title,
          excerpt: a.excerpt,
        }))
      : fallbackBulletins;

  return (
    <OverlaySection range={range} layerIndex={layerIndex} forceVisible={forceVisible}>
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-white md:text-5xl">Buletin informativ</h2>
          <p className="mt-3 text-white/60">
            Panou digital cu anunțuri, termene și resurse pentru comunitate.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <a key={item.id} href="#" className="group block">
              <GlassPanel className="h-full transition-transform duration-400 group-hover:scale-[1.03]">
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-white/65">{item.excerpt}</p>
              </GlassPanel>
            </a>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="#anunturi" className={cn(buttonVariants({ variant: "primary", size: "md" }))}>
            Vezi toate anunțurile
          </a>
        </div>
      </div>
    </OverlaySection>
  );
}
