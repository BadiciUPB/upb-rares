"use client";

import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { homeScrollOffset } from "@/components/home/scroll-store";

/** Publishes Drei scroll offset to the HTML overlay layer. */
export function ScrollBridge() {
  const scroll = useScroll();

  useFrame(() => {
    homeScrollOffset.current = scroll.offset;
  });

  return null;
}
