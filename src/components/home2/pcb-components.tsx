import type { PcbComponent } from "@/components/home2/pcb-geometry";

const COPPER = "#c8d4e8";
const COPPER_DIM = "#8fa3bf";
const PAD = "#dce6f5";
const MASK = "#0a1a33";
const SILK = "#e2e8f0";

function Pad({ x, y, w = 10, h = 14 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <rect
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      rx={1.2}
      fill={PAD}
      stroke={COPPER}
      strokeWidth={0.6}
    />
  );
}

function Via({ x, y, size = "sm" }: { x: number; y: number; size?: "sm" | "md" }) {
  const r = size === "md" ? 5.5 : 3.8;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={PAD} stroke={COPPER_DIM} strokeWidth={0.8} />
      <circle cx={x} cy={y} r={r * 0.42} fill={MASK} />
    </g>
  );
}

function Resistor({ x, y, label, rot = 0 }: { x: number; y: number; label: string; rot?: number }) {
  const bands = ["#dc2626", "#eab308", "#2563eb", "#64748b"];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <Pad x={-16} y={0} w={9} h={12} />
      <Pad x={16} y={0} w={9} h={12} />
      <rect x={-10} y={-4.5} width={20} height={9} rx={1.5} fill="#1e293b" stroke={SILK} strokeOpacity={0.35} strokeWidth={0.5} />
      {bands.map((color, i) => (
        <rect key={i} x={-7 + i * 3.5} y={-2.5} width={2} height={5} fill={color} />
      ))}
      <text x={0} y={-12} textAnchor="middle" fontSize={9} fill={SILK} fillOpacity={0.55} fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

function Capacitor({ x, y, label, rot = 0 }: { x: number; y: number; label: string; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <Pad x={-14} y={0} w={9} h={12} />
      <Pad x={14} y={0} w={9} h={12} />
      <rect x={-9} y={-5} width={18} height={10} rx={1.2} fill="#1a2744" stroke={COPPER_DIM} strokeWidth={0.6} />
      <line x1={-4} y1={-5} x2={-4} y2={5} stroke={SILK} strokeOpacity={0.4} strokeWidth={0.8} />
      <line x1={4} y1={-5} x2={4} y2={5} stroke={SILK} strokeOpacity={0.4} strokeWidth={0.8} />
      <text x={0} y={-12} textAnchor="middle" fontSize={9} fill={SILK} fillOpacity={0.55} fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

function IC({ x, y, label, pins = 16 }: { x: number; y: number; label: string; pins?: number }) {
  const pinCount = pins / 2;
  const bodyW = 44;
  const bodyH = 44;
  const pinW = 8;
  const pinH = 4;
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: pinCount }).map((_, i) => (
        <rect
          key={`l-${i}`}
          x={-bodyW / 2 - pinW}
          y={-bodyH / 2 + 4 + i * ((bodyH - 8) / (pinCount - 1 || 1))}
          width={pinW}
          height={pinH}
          rx={0.6}
          fill={PAD}
          stroke={COPPER}
          strokeWidth={0.5}
        />
      ))}
      {Array.from({ length: pinCount }).map((_, i) => (
        <rect
          key={`r-${i}`}
          x={bodyW / 2}
          y={-bodyH / 2 + 4 + i * ((bodyH - 8) / (pinCount - 1 || 1))}
          width={pinW}
          height={pinH}
          rx={0.6}
          fill={PAD}
          stroke={COPPER}
          strokeWidth={0.5}
        />
      ))}
      <rect x={-bodyW / 2} y={-bodyH / 2} width={bodyW} height={bodyH} rx={2} fill="#111827" stroke={SILK} strokeOpacity={0.4} strokeWidth={0.7} />
      <circle cx={-bodyW / 2 + 6} cy={-bodyH / 2 + 6} r={2.2} fill={MASK} stroke={SILK} strokeOpacity={0.3} strokeWidth={0.5} />
      <text x={0} y={4} textAnchor="middle" fontSize={10} fill={SILK} fillOpacity={0.7} fontFamily="monospace" fontWeight={600}>
        {label}
      </text>
    </g>
  );
}

function LED({ x, y, label, energized }: { x: number; y: number; label: string; energized?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <Pad x={-12} y={0} w={8} h={10} />
      <Pad x={12} y={0} w={8} h={10} />
      <circle cx={0} cy={0} r={7} fill="#1e293b" stroke={COPPER_DIM} strokeWidth={0.6} />
      <path d="M -3 2 L 0 -3 L 3 2 Z" fill="#22d3ee" fillOpacity={energized ? 0.95 : 0.35}>
        {energized && (
          <animate attributeName="fill-opacity" values="0.5;1;0.5" dur="1.2s" repeatCount="indefinite" />
        )}
      </path>
      {energized && (
        <circle cx={0} cy={0} r={12} fill="#22d3ee" fillOpacity={0.12}>
          <animate attributeName="fill-opacity" values="0.05;0.18;0.05" dur="1.2s" repeatCount="indefinite" />
        </circle>
      )}
      <text x={0} y={-14} textAnchor="middle" fontSize={9} fill={SILK} fillOpacity={0.55} fontFamily="monospace">
        {label}
      </text>
    </g>
  );
}

export function PcbComponentFootprint({ component, energized }: { component: PcbComponent; energized: boolean }) {
  const glow = energized ? 0.95 : 0.55;
  return (
    <g opacity={glow}>
      {component.kind === "resistor" && (
        <Resistor x={component.x} y={component.y} label={component.label} rot={component.rot} />
      )}
      {component.kind === "capacitor" && (
        <Capacitor x={component.x} y={component.y} label={component.label} rot={component.rot} />
      )}
      {component.kind === "ic" && (
        <IC x={component.x} y={component.y} label={component.label} pins={component.pins} />
      )}
      {component.kind === "led" && (
        <LED x={component.x} y={component.y} label={component.label} energized={energized} />
      )}
      {energized && (
        <circle cx={component.x} cy={component.y} r={18} fill="#22d3ee" fillOpacity={0.08}>
          <animate attributeName="fill-opacity" values="0.04;0.12;0.04" dur="1.4s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
}

export function PcbVia({ x, y, size, lit }: { x: number; y: number; size?: "sm" | "md"; lit: boolean }) {
  return (
    <g>
      <Via x={x} y={y} size={size} />
      {lit && (
        <circle cx={x} cy={y} r={size === "md" ? 9 : 6} fill="#67e8f9" fillOpacity={0.15}>
          <animate attributeName="r" values={`${size === "md" ? 7 : 5};${size === "md" ? 11 : 8};${size === "md" ? 7 : 5}`} dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
}

export function Fiducial({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={8} fill="none" stroke={SILK} strokeOpacity={0.35} strokeWidth={0.8} />
      <circle cx={x} cy={y} r={3} fill={SILK} fillOpacity={0.45} />
    </g>
  );
}
