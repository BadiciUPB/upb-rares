"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { corridorStations } from "@/components/home/camera-stops";

/** Hero focal point — blue geometric orb only. */
export function AcademicCore() {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.12;
  });

  return (
    <group position={[0, 1.25, corridorStations.hero]}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial
          color="#1e3a6e"
          emissive="#3b82f6"
          emissiveIntensity={0.35}
          metalness={0.3}
          roughness={0.45}
          wireframe
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.38, 0]} />
        <meshStandardMaterial
          color="#132c50"
          emissive="#3b82f6"
          emissiveIntensity={0.2}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}
