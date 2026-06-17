"use client";

import type { ReactNode } from "react";
import { getLayerTransform } from "@/components/home/scroll-rail";
import { useHomeScroll } from "@/components/home/use-home-scroll";
import { cn } from "@/lib/utils";

export function OverlaySection({
  range,
  layerIndex,
  children,
  className,
  align = "center",
  forceVisible = false,
}: {
  range: [number, number];
  layerIndex: number;
  children: ReactNode;
  className?: string;
  align?: "center" | "top" | "split";
  forceVisible?: boolean;
}) {
  const offset = useHomeScroll();
  const layer = forceVisible
    ? {
        opacity: 1,
        scale: 1,
        translateZ: 0,
        blur: 0,
        zIndex: layerIndex,
        active: true,
      }
    : getLayerTransform(offset, range, layerIndex);

  return (
    <section
      className={cn(
        forceVisible
          ? "relative flex w-full px-0 py-0"
          : "absolute inset-0 flex px-6 pt-28 pb-12 md:px-10 md:pt-32",
        align === "center" && "items-center justify-center",
        align === "top" && "items-start justify-center",
        align === "split" && "items-center",
        className,
      )}
      style={{
        opacity: layer.opacity,
        zIndex: layer.zIndex,
        pointerEvents: layer.active ? "auto" : "none",
        transformStyle: "preserve-3d",
        willChange: forceVisible ? undefined : "transform, opacity, filter",
      }}
      aria-hidden={!layer.active}
    >
      <div
        className="w-full"
        style={{
          transform: forceVisible
            ? undefined
            : `translateZ(${layer.translateZ}px) scale(${layer.scale})`,
          filter: forceVisible ? undefined : `blur(${layer.blur}px)`,
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
        }}
      >
        {children}
      </div>
    </section>
  );
}
