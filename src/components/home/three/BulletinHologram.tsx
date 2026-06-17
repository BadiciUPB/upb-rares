"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { corridorStations } from "@/components/home/camera-stops";

export function BulletinHologram() {
  const boardRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!boardRef.current) return;
    boardRef.current.position.y = 1.3 + Math.sin(Date.now() * 0.001) * 0.04;
  });

  return (
    <group position={[0, 0, corridorStations.bulletin]} ref={boardRef}>
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[6.5, 3.8, 0.1]} />
        <meshStandardMaterial
          color="#0a1a33"
          emissive="#3b82f6"
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {[
        [-2, 0.9],
        [2, 0.9],
        [-2, -0.7],
        [2, -0.7],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, 1.3 + y, 0.08]}>
          <planeGeometry args={[2, 1.1]} />
          <meshStandardMaterial
            color="#132c50"
            emissive="#06b6d4"
            emissiveIntensity={0.25 + i * 0.05}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}
