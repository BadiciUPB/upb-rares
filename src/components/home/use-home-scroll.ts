"use client";

import { useSyncExternalStore } from "react";
import { homeScrollOffset } from "@/components/home/scroll-store";

function subscribe(onStoreChange: () => void) {
  let raf = 0;
  const tick = () => {
    onStoreChange();
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

function getSnapshot() {
  return homeScrollOffset.current;
}

function getServerSnapshot() {
  return 0;
}

export function useHomeScroll() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
