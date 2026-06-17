import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/15 bg-[#0a1a33]/75 p-6 shadow-2xl backdrop-blur-xl md:p-8",
        "ring-1 ring-cyan-400/10",
        className,
      )}
    >
      {children}
    </div>
  );
}
