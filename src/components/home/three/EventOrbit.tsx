"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { corridorStations } from "@/components/home/camera-stops";

export function EventOrbit() {
  const orbitRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.z += delta * 0.12;
  });

  return (
    <group position={[0, 1.35, corridorStations.events]}>
      <mesh>
        <boxGeometry args={[5.5, 3.2, 0.12]} />
        <meshStandardMaterial
          color="#0a1a33"
          emissive="#06b6d4"
          emissiveIntensity={0.35}
          transparent
          opacity={0.75}
        />
      </mesh>

      <group ref={orbitRef} position={[0, 0, 0.25]}>
        <mesh>
          <torusGeometry args={[2, 0.03, 8, 64]} />
          <meshStandardMaterial
            color="#eed202"
            emissive="#eed202"
            emissiveIntensity={0.6}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.4, 0.02, 8, 48]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#3b82f6"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>

      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-1.8 + i * 1.8, -0.15 + (i % 2) * 0.25, 0.15]}>
          <planeGeometry args={[1.4, 0.8]} />
          <meshStandardMaterial
            color="#132c50"
            emissive="#3b82f6"
            emissiveIntensity={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}
