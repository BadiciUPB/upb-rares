"use client";

import { memo, useEffect, useRef, type RefObject } from "react";
import {
  BOARD_HEIGHT,
  BUS_PATH,
  PCB_COMPONENTS,
  POWER_RAILS,
  buildBranchTraces,
  buildCopperField,
  buildVias,
  clamp01,
} from "@/components/home2/pcb-geometry";
import { Fiducial, PcbComponentFootprint, PcbVia } from "@/components/home2/pcb-components";
import { readScrollProgress } from "@/components/home2/use-home2-scroll";

const BRANCH_TRACES = buildBranchTraces();
const COPPER_FIELD = buildCopperField();
const VIAS = buildVias();

const PcbBoardArtwork = memo(function PcbBoardArtwork() {
  return (
    <>
      <rect width="1024" height={BOARD_HEIGHT} fill="#0a1a33" />
      <rect width="1024" height={BOARD_HEIGHT} fill="url(#h2-mask-grid)" />
      <rect width="1024" height={BOARD_HEIGHT} fill="url(#h2-fine-grid)" />
      <rect x="60" y="60" width="904" height={BOARD_HEIGHT - 120} rx="8" fill="#0d2447" fillOpacity={0.35} />

      {POWER_RAILS.map((d, i) => (
        <path
          key={`rail-${i}`}
          d={d}
          fill="none"
          stroke="#9fb3cc"
          strokeOpacity={0.22}
          strokeWidth={i < 2 ? 8 : 4}
          strokeLinecap="square"
        />
      ))}

      {COPPER_FIELD.map((d, i) => (
        <path
          key={`field-${i}`}
          d={d}
          fill="none"
          stroke="#8fa3bf"
          strokeOpacity={0.14}
          strokeWidth={1.2}
          strokeLinecap="square"
        />
      ))}

      {BRANCH_TRACES.map((d, i) => (
        <path
          key={`branch-${i}`}
          d={d}
          fill="none"
          stroke="#8fa3bf"
          strokeOpacity={0.18}
          strokeWidth={2.2}
          strokeLinecap="square"
        />
      ))}

      <path
        d={BUS_PATH}
        fill="none"
        stroke="#b8c5d6"
        strokeOpacity={0.28}
        strokeWidth={5}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      {VIAS.map((v, i) => (
        <PcbVia key={`via-${i}`} x={v.x} y={v.y} size={v.size} lit={false} />
      ))}

      <Fiducial x={80} y={80} />
      <Fiducial x={944} y={80} />
      <Fiducial x={80} y={BOARD_HEIGHT - 80} />
      <Fiducial x={944} y={BOARD_HEIGHT - 80} />

      {PCB_COMPONENTS.map((c) => (
        <PcbComponentFootprint
          key={`${c.label}-${c.x}-${c.y}`}
          component={c}
          energized={false}
        />
      ))}

      <text x={512} y={36} textAnchor="middle" fontSize={14} fill="#e2e8f0" fillOpacity={0.35} fontFamily="monospace" letterSpacing={4}>
        UNST-PCB-REV.A
      </text>
      <text x={96} y={BOARD_HEIGHT - 36} fontSize={11} fill="#e2e8f0" fillOpacity={0.28} fontFamily="monospace">
        GND
      </text>
      <text x={900} y={BOARD_HEIGHT - 36} textAnchor="end" fontSize={11} fill="#e2e8f0" fillOpacity={0.28} fontFamily="monospace">
        +3V3
      </text>
    </>
  );
});

function setSparkTransform(group: SVGGElement | null, x: number, y: number, size: number, primary = false) {
  if (!group) return;
  const r = (primary ? 11 : 8) * size;
  group.setAttribute("transform", `translate(${x} ${y})`);
  group.style.opacity = String(0.55 + size * 0.45);

  const outer = group.querySelector<SVGCircleElement>("[data-spark='outer']");
  const mid = group.querySelector<SVGCircleElement>("[data-spark='mid']");
  const core = group.querySelector<SVGCircleElement>("[data-spark='core']");
  if (outer) outer.setAttribute("r", String(r * 3.2));
  if (mid) mid.setAttribute("r", String(r * 1.5));
  if (core) core.setAttribute("r", String(r * 0.6));
}

export function PcbBoard({ scrollerRef }: { scrollerRef: RefObject<HTMLElement | null> }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const busGuideRef = useRef<SVGPathElement>(null);
  const busLiveRef = useRef<SVGPathElement>(null);
  const sparkPrimaryRef = useRef<SVGGElement>(null);
  const busLengthRef = useRef(0);
  const scrollSmoothRef = useRef(0);
  const sparkProgressRef = useRef(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    let raf = 0;

    const tick = () => {
      const target = readScrollProgress(scroller);
      const scrollEased = scrollSmoothRef.current + (target - scrollSmoothRef.current) * 0.08;
      scrollSmoothRef.current = Math.abs(scrollEased - target) < 0.00025 ? target : scrollEased;

      // Start filling only after user has started scrolling.
      const targetSpark = clamp01((scrollSmoothRef.current - 0.03) / 0.97);
      const sparkStep = (targetSpark - sparkProgressRef.current) * 0.045;
      // Cap per-frame advancement to keep horizontal runs calm.
      const boundedStep = Math.max(-0.003, Math.min(0.003, sparkStep));
      sparkProgressRef.current = clamp01(sparkProgressRef.current + boundedStep);
      const energize = sparkProgressRef.current;

      const guide = busGuideRef.current;
      if (guide && busLengthRef.current === 0) {
        busLengthRef.current = guide.getTotalLength();
      }
      const busLength = busLengthRef.current;
      const sparkPoint = guide && busLength > 0
        ? guide.getPointAtLength(busLength * energize)
        : { x: 512, y: 40 };

      const svg = svgRef.current;
      if (svg) {
        const rect = svg.getBoundingClientRect();
        const visibleW = 1024;
        const visibleH = visibleW * (rect.height / Math.max(rect.width, 1));
        const topMargin = 108;
        const offset = Math.max(0, Math.min(BOARD_HEIGHT - visibleH, sparkPoint.y - topMargin));
        svg.setAttribute("viewBox", `0 ${offset} ${visibleW} ${visibleH}`);
      }

      if (busLiveRef.current) {
        busLiveRef.current.style.strokeDashoffset = String(100 - energize * 100);
      }

      setSparkTransform(sparkPrimaryRef.current, sparkPoint.x, sparkPoint.y, 0.9, true);

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollerRef]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-[#071428]" aria-hidden="true">
      <svg
        ref={svgRef}
        className="h-full w-full"
        viewBox="0 0 1024 900"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="h2-mask-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#1e3a5f" strokeWidth="0.4" />
          </pattern>
          <pattern id="h2-fine-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M10 0H0V10" fill="none" stroke="#132c50" strokeWidth="0.25" />
          </pattern>
          <linearGradient id="h2-copper-live" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <filter id="h2-spark-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="h2-trace-glow">
            <feGaussianBlur stdDeviation="1.8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g>
          <PcbBoardArtwork />

          <path
            ref={busGuideRef}
            d={BUS_PATH}
            fill="none"
            stroke="none"
          />

          <path
            ref={busLiveRef}
            d={BUS_PATH}
            fill="none"
            stroke="url(#h2-copper-live)"
            strokeWidth={3.5}
            strokeLinecap="square"
            strokeLinejoin="miter"
            filter="url(#h2-trace-glow)"
            pathLength={100}
            strokeDasharray="100"
            strokeDashoffset={100}
          />

          <g ref={sparkPrimaryRef} filter="url(#h2-spark-glow)">
            <circle data-spark="outer" r={20} fill="#22d3ee" fillOpacity={0.14} />
            <circle data-spark="mid" r={9} fill="#67e8f9" fillOpacity={0.48} />
            <circle data-spark="core" r={3.8} fill="#ecfeff" />
          </g>
        </g>
      </svg>
    </div>
  );
}
