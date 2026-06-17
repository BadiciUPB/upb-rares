"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

/** Tracks active slide index from scroll position. */
export function useHome2Scroll(scrollerRef: RefObject<HTMLElement | null>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let raf = 0;
    const tick = () => {
      const vh = scroller.clientHeight || 1;
      const idx = Math.round(scroller.scrollTop / vh);
      const nextIndex = Math.max(0, Math.min(4, idx));
      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollerRef]);

  return { activeIndex };
}

export function readScrollProgress(scroller: HTMLElement) {
  const vh = scroller.clientHeight || 1;
  const max = Math.max(1, scroller.scrollHeight - vh);
  return clamp01(scroller.scrollTop / max);
}
