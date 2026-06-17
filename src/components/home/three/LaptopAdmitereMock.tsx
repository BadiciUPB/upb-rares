"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type * as THREE from "three";
import { corridorStations } from "@/components/home/camera-stops";

const LAPTOP_POSITION: [number, number, number] = [0, 0.75, corridorStations.laptop];

export function LaptopAdmitereMock() {
  const screenRef = useRef<THREE.Mesh>(null);
  const lidRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (lidRef.current) lidRef.current.rotation.x = -Math.PI / 6;
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.25 + Math.sin(Date.now() * 0.002) * 0.05;
    }
  });

  return (
    <group position={LAPTOP_POSITION}>
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[2.2, 0.07, 1.5]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.5} />
      </mesh>

      <group ref={lidRef} position={[0, 0.04, -0.6]}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[2.1, 1.05, 0.05]} />
          <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.5} />
        </mesh>

        <mesh ref={screenRef} position={[0, 0.5, 0.035]}>
          <planeGeometry args={[1.9, 0.92]} />
          <meshStandardMaterial
            color="#0a1a33"
            emissive="#3b82f6"
            emissiveIntensity={0.25}
          />
        </mesh>

        <mesh position={[0, 0.58, 0.04]}>
          <planeGeometry args={[1.2, 0.07]} />
          <meshStandardMaterial color="#132c50" emissive="#1e40af" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0, 0.2, 0.04]}>
          <planeGeometry args={[0.65, 0.09]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.25} />
        </mesh>

        <Text
          position={[0, 0.58, 0.045]}
          fontSize={0.07}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.6}
        >
          Admitere 2026
        </Text>
      </group>
    </group>
  );
}

export { LAPTOP_POSITION };
