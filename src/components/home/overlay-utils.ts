import { clamp01 } from "@/lib/easing";

const FADE = 0.04;

export function getOverlayOpacity(
  scrollOffset: number,
  range: [number, number],
): number {
  const [start, end] = range;
  if (scrollOffset < start - FADE || scrollOffset > end + FADE) return 0;
  if (scrollOffset < start) return clamp01((scrollOffset - (start - FADE)) / FADE);
  if (scrollOffset > end) return clamp01(1 - (scrollOffset - end) / FADE);
  return 1;
}

export function isOverlayActive(
  scrollOffset: number,
  range: [number, number],
): boolean {
  return getOverlayOpacity(scrollOffset, range) > 0.35;
}
