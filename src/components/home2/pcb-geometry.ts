/** Long vertical PCB coordinate space (viewBox width 1024). */
export const BOARD_HEIGHT = 4200;

export const BUS_PATH =
  "M 512 40 V 180 H 340 V 280 H 512 V 380 H 680 V 480 H 512 " +
  "V 620 H 280 V 760 H 512 V 900 H 740 V 1040 H 512 " +
  "V 1180 H 300 V 1320 H 512 V 1460 H 720 V 1600 H 512 " +
  "V 1740 H 260 V 1880 H 512 V 2020 H 780 V 2160 H 512 " +
  "V 2300 H 320 V 2440 H 512 V 2580 H 700 V 2720 H 512 " +
  "V 2860 H 290 V 3000 H 512 V 3140 H 760 V 3280 H 512 " +
  "V 3420 H 512 V 3560 H 512 V 3700";

/** Dense samples along the main bus for spark interpolation. */
export const BUS_WAYPOINTS: { x: number; y: number }[] = (() => {
  const pts: { x: number; y: number }[] = [];
  let x = 512;
  let y = 40;
  const segments: Array<{ dx: number; dy: number; steps: number }> = [
    { dx: 0, dy: 140, steps: 10 },
    { dx: -172, dy: 0, steps: 6 },
    { dx: 0, dy: 100, steps: 8 },
    { dx: 172, dy: 0, steps: 6 },
    { dx: 0, dy: 100, steps: 8 },
    { dx: 168, dy: 0, steps: 6 },
    { dx: 0, dy: 100, steps: 8 },
    { dx: -232, dy: 0, steps: 8 },
    { dx: 0, dy: 140, steps: 10 },
    { dx: 228, dy: 0, steps: 8 },
    { dx: 0, dy: 140, steps: 10 },
    { dx: -212, dy: 0, steps: 8 },
    { dx: 0, dy: 140, steps: 10 },
    { dx: 208, dy: 0, steps: 8 },
    { dx: 0, dy: 140, steps: 10 },
    { dx: -252, dy: 0, steps: 9 },
    { dx: 0, dy: 140, steps: 10 },
    { dx: 268, dy: 0, steps: 9 },
    { dx: 0, dy: 140, steps: 10 },
    { dx: -220, dy: 0, steps: 8 },
    { dx: 0, dy: 140, steps: 10 },
    { dx: 188, dy: 0, steps: 8 },
    { dx: 0, dy: 140, steps: 10 },
    { dx: -222, dy: 0, steps: 8 },
    { dx: 0, dy: 140, steps: 10 },
    { dx: 250, dy: 0, steps: 9 },
    { dx: 0, dy: 140, steps: 10 },
    { dx: 0, dy: 140, steps: 10 },
    { dx: 0, dy: 140, steps: 10 },
  ];
  pts.push({ x, y });
  for (const seg of segments) {
    for (let i = 1; i <= seg.steps; i++) {
      x += seg.dx / seg.steps;
      y += seg.dy / seg.steps;
      pts.push({ x, y });
    }
  }
  return pts;
})();

export type PcbComponent =
  | { kind: "resistor"; x: number; y: number; label: string; rot?: number }
  | { kind: "capacitor"; x: number; y: number; label: string; rot?: number }
  | { kind: "ic"; x: number; y: number; label: string; pins?: number }
  | { kind: "led"; x: number; y: number; label: string };

export const PCB_COMPONENTS: PcbComponent[] = [
  { kind: "ic", x: 512, y: 240, label: "U1", pins: 16 },
  { kind: "resistor", x: 180, y: 320, label: "R1" },
  { kind: "capacitor", x: 720, y: 320, label: "C1" },
  { kind: "resistor", x: 260, y: 520, label: "R2" },
  { kind: "capacitor", x: 680, y: 520, label: "C2" },
  { kind: "ic", x: 512, y: 700, label: "U2", pins: 8 },
  { kind: "led", x: 840, y: 700, label: "D1" },
  { kind: "resistor", x: 200, y: 900, label: "R3" },
  { kind: "capacitor", x: 760, y: 900, label: "C3" },
  { kind: "ic", x: 512, y: 1100, label: "U3", pins: 16 },
  { kind: "resistor", x: 170, y: 1280, label: "R4" },
  { kind: "capacitor", x: 730, y: 1280, label: "C4" },
  { kind: "ic", x: 512, y: 1500, label: "U4", pins: 8 },
  { kind: "led", x: 860, y: 1500, label: "D2" },
  { kind: "resistor", x: 220, y: 1700, label: "R5" },
  { kind: "capacitor", x: 700, y: 1700, label: "C5" },
  { kind: "ic", x: 512, y: 1900, label: "U5", pins: 16 },
  { kind: "resistor", x: 190, y: 2100, label: "R6" },
  { kind: "capacitor", x: 750, y: 2100, label: "C6" },
  { kind: "ic", x: 512, y: 2320, label: "U6", pins: 8 },
  { kind: "resistor", x: 240, y: 2520, label: "R7" },
  { kind: "capacitor", x: 680, y: 2520, label: "C7" },
  { kind: "ic", x: 512, y: 2740, label: "U7", pins: 16 },
  { kind: "led", x: 820, y: 2740, label: "D3" },
  { kind: "resistor", x: 210, y: 2960, label: "R8" },
  { kind: "capacitor", x: 740, y: 2960, label: "C8" },
  { kind: "ic", x: 512, y: 3180, label: "U8", pins: 8 },
  { kind: "resistor", x: 230, y: 3400, label: "R9" },
  { kind: "capacitor", x: 710, y: 3400, label: "C9" },
];

/** Branch traces — orthogonal L-routes from pads to main bus. */
export function buildBranchTraces(): string[] {
  const paths: string[] = [];
  for (const c of PCB_COMPONENTS) {
    const busX = 512;
    const midY = c.y + (c.x < busX ? 18 : -18);
    if (c.x < busX) {
      paths.push(`M ${c.x + 16} ${c.y} H ${busX - 8} V ${midY} H ${busX}`);
    } else if (c.x > busX) {
      paths.push(`M ${c.x - 16} ${c.y} H ${busX + 8} V ${midY} H ${busX}`);
    } else {
      paths.push(`M ${c.x} ${c.y + 22} V ${busX === c.x ? c.y + 40 : c.y} H ${busX}`);
    }
  }
  // Supplementary signal routing between IC pairs
  for (let i = 0; i < PCB_COMPONENTS.length - 1; i += 3) {
    const a = PCB_COMPONENTS[i];
    const b = PCB_COMPONENTS[i + 1];
    if (!b) continue;
    paths.push(`M ${a.x + 24} ${a.y} H ${a.x + 60} V ${b.y} H ${b.x - 24}`);
  }
  return paths;
}

/** Wide power rails flanking the main bus. */
export const POWER_RAILS = [
  "M 140 80 V 3700",
  "M 884 80 V 3700",
  "M 140 80 H 884",
  "M 140 3700 H 884",
] as const;

/** Background routing — dense orthogonal copper. */
export function buildCopperField(): string[] {
  const paths: string[] = [];
  for (let y = 100; y < BOARD_HEIGHT; y += 48) {
    const offset = (y / 48) % 2 === 0 ? 0 : 24;
    paths.push(`M ${40 + offset} ${y} H ${984 - offset}`);
    if (y % 96 === 52) {
      paths.push(`M ${120 + offset} ${y - 24} V ${y + 72}`);
      paths.push(`M ${320 + offset} ${y - 48} V ${y + 48}`);
      paths.push(`M ${720 - offset} ${y - 36} V ${y + 60}`);
      paths.push(`M ${880 - offset} ${y - 24} V ${y + 72}`);
    }
  }
  return paths;
}

export function buildVias(): { x: number; y: number; size?: "sm" | "md" }[] {
  const vias: { x: number; y: number; size?: "sm" | "md" }[] = [];
  for (const c of PCB_COMPONENTS) {
    const side = c.x < 512 ? 1 : -1;
    vias.push({ x: c.x + side * 28, y: c.y - 14, size: "sm" });
    vias.push({ x: c.x + side * 28, y: c.y + 14, size: "sm" });
    if (c.kind === "ic") {
      vias.push({ x: c.x - 34, y: c.y + 34, size: "md" });
      vias.push({ x: c.x + 34, y: c.y - 34, size: "md" });
    }
  }

  for (let y = 160; y < BOARD_HEIGHT; y += 220) {
    vias.push({ x: 140, y, size: "md" });
    vias.push({ x: 884, y: y + 80, size: "md" });
  }

  return vias;
}

export function sampleBus(progress: number) {
  const t = Math.min(1, Math.max(0, progress));
  const idx = t * (BUS_WAYPOINTS.length - 1);
  const i = Math.floor(idx);
  const f = idx - i;
  const smoothF = f * f * (3 - 2 * f);
  const a = BUS_WAYPOINTS[i];
  const b = BUS_WAYPOINTS[Math.min(i + 1, BUS_WAYPOINTS.length - 1)];
  return {
    x: a.x + (b.x - a.x) * smoothF,
    y: a.y + (b.y - a.y) * smoothF,
  };
}

export function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function sampleBusSegment(progress: number, length = 0.04) {
  const start = clamp01(progress - length);
  const end = clamp01(progress + length * 0.25);
  const a = sampleBus(start);
  const b = sampleBus(end);
  return { a, b, start, end };
}
