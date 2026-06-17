"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { corridorStations } from "@/components/home/camera-stops";

function WallPortal({
  position,
  color,
  rotationY = 0,
}: {
  position: [number, number, number];
  color: string;
  rotationY?: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12;
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} ref={ref}>
      <mesh>
        <torusGeometry args={[0.9, 0.05, 12, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.85}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[1.1, 1.5, 0.08]} />
        <meshStandardMaterial
          color="#132c50"
          emissive="#3b82f6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  );
}

export function CityPortals() {
  const z = corridorStations.campuses;

  return (
    <group position={[0, 0, z]}>
      <WallPortal position={[-2.35, 1.3, 0]} color="#3b82f6" rotationY={Math.PI / 2} />
      <WallPortal position={[2.35, 1.3, 0]} color="#06b6d4" rotationY={-Math.PI / 2} />

      {/* Alcove marker on the floor */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.6, 32]} />
        <meshStandardMaterial
          color="#1e40af"
          emissive="#3b82f6"
          emissiveIntensity={0.25}
          transparent
          opacity={0.5}
          side={2}
        />
      </mesh>
    </group>
  );
}
