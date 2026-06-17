import { cameraStops } from "@/components/home/camera-stops";
import {
  clamp01,
  easeInCubic,
  easeInExpo,
  easeOutCubic,
  lerp,
} from "@/lib/easing";

export type LayerTransform = {
  opacity: number;
  scale: number;
  translateZ: number;
  blur: number;
  zIndex: number;
  active: boolean;
};

/** Fast punch-through between stops; slow dwell while on a slide. */
export function remapRailProgress(linear: number): number {
  const segments = cameraStops.length - 1;
  const scaled = clamp01(linear) * segments;
  const index = Math.min(segments - 1, Math.floor(scaled));
  const local = scaled - index;

  const HOLD = 0.22;
  const PUNCH = 1 - HOLD * 2;

  let eased: number;
  if (local < HOLD) {
    eased = 0;
  } else if (local > 1 - HOLD) {
    eased = 1;
  } else {
    const punchT = (local - HOLD) / PUNCH;
    eased = easeInExpo(punchT);
  }

  return clamp01((index + eased) / segments);
}

export function getLayerTransform(
  scrollOffset: number,
  range: [number, number],
  layerIndex: number,
): LayerTransform {
  const [start, end] = range;
  const mid = (start + end) / 2;
  const half = Math.max(0.001, (end - start) / 2);
  const bleed = half * 0.55;
  const dist = (scrollOffset - mid) / (half + bleed);

  if (Math.abs(dist) > 1.15) {
    return {
      opacity: 0,
      scale: 0.65,
      translateZ: -480,
      blur: 16,
      zIndex: layerIndex,
      active: false,
    };
  }

  let opacity: number;
  let scale: number;
  let translateZ: number;
  let blur: number;

  if (dist <= 0) {
    const t = easeOutCubic(clamp01(1 + dist));
    opacity = t;
    scale = lerp(0.68, 1, t);
    translateZ = lerp(-520, 0, t);
    blur = lerp(12, 0, t);
  } else {
    const t = easeInCubic(clamp01(dist));
    opacity = 1 - t;
    scale = lerp(1, 3.2, t);
    translateZ = lerp(0, 640, t);
    blur = lerp(0, 18, t);
  }

  const zIndex = layerIndex * 20 + Math.round((1 - Math.abs(dist)) * 80);

  return {
    opacity,
    scale,
    translateZ,
    blur,
    zIndex,
    active: opacity > 0.2,
  };
}

/** Brightness pulse while passing between stacked slides. */
export function getTransitionVeil(scrollOffset: number): number {
  let max = 0;

  for (let i = 0; i < cameraStops.length - 1; i++) {
    const gapStart = cameraStops[i].overlayRange[1];
    const gapEnd = cameraStops[i + 1].overlayRange[0];
    const gapMid = (gapStart + gapEnd) / 2;
    const gapHalf = Math.max(0.004, (gapEnd - gapStart) / 2 + 0.02);
    const d = Math.abs(scrollOffset - gapMid) / gapHalf;
    if (d < 1) {
      max = Math.max(max, (1 - d) * (1 - d));
    }
  }

  return max;
}
