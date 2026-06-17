"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cameraStops, corridorStations } from "@/components/home/camera-stops";
import { getLayerTransform } from "@/components/home/scroll-rail";
import { homeScrollOffset } from "@/components/home/scroll-store";

const PLANE_Z = [
  corridorStations.hero,
  corridorStations.campuses,
  corridorStations.events,
  corridorStations.bulletin,
  corridorStations.laptop,
];

function RailPlane({
  range,
  layerIndex,
  z,
  color,
}: {
  range: [number, number];
  layerIndex: number;
  z: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    const layer = getLayerTransform(homeScrollOffset.current, range, layerIndex);
    if (!ref.current || !matRef.current) return;

    const approach = layer.translateZ / 640;
    ref.current.position.z = z - approach * 1.5;
    ref.current.scale.setScalar(0.9 + layer.scale * 0.15);
    matRef.current.opacity = layer.opacity * 0.2;
    matRef.current.emissiveIntensity = 0.25 + layer.opacity * 0.45;
  });

  return (
    <mesh ref={ref} position={[0, 1.45, z]}>
      <planeGeometry args={[5.2, 3.4]} />
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.35}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export function RailPlanes() {
  const colors = ["#3b82f6", "#06b6d4", "#eed202", "#60a5fa", "#22d3ee"];

  return (
    <group>
      {cameraStops.map((stop, i) => (
        <RailPlane
          key={stop.id}
          range={stop.overlayRange}
          layerIndex={i}
          z={PLANE_Z[i]}
          color={colors[i] ?? "#3b82f6"}
        />
      ))}
    </group>
  );
}
