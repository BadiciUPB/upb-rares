"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Particles({ count = 80 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>(
    (() => {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        arr[i * 3] = (Math.random() - 0.5) * 4.5;
        arr[i * 3 + 1] = 0.5 + Math.random() * 3.2;
        arr[i * 3 + 2] = 6 - Math.random() * 28;
      }
      return arr;
    })(),
  );

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.position.z -= delta * 0.15;
    if (ref.current.position.z < -4) ref.current.position.z = 0;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#06b6d4"
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
