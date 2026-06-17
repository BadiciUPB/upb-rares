"use client";

const CORRIDOR_LENGTH = 34;
const CORRIDOR_WIDTH = 5.6;
const CORRIDOR_HEIGHT = 4.2;
const CORRIDOR_CENTER_Z = -9;

/** Minimal dark corridor — no accent lines or rails. */
export function Hallway() {
  const halfW = CORRIDOR_WIDTH / 2;

  return (
    <group position={[0, 0, CORRIDOR_CENTER_Z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[CORRIDOR_WIDTH, CORRIDOR_LENGTH]} />
        <meshStandardMaterial
          color="#0a1a33"
          emissive="#0a1a33"
          emissiveIntensity={0.05}
          metalness={0.2}
          roughness={0.85}
        />
      </mesh>

      {[-halfW, halfW].map((x) => (
        <mesh key={x} position={[x, CORRIDOR_HEIGHT / 2, 0]}>
          <boxGeometry args={[0.08, CORRIDOR_HEIGHT, CORRIDOR_LENGTH]} />
          <meshStandardMaterial
            color="#0a1a33"
            emissive="#132c50"
            emissiveIntensity={0.04}
            roughness={0.9}
          />
        </mesh>
      ))}

      <mesh position={[0, CORRIDOR_HEIGHT, 0]}>
        <boxGeometry args={[CORRIDOR_WIDTH, 0.08, CORRIDOR_LENGTH]} />
        <meshStandardMaterial color="#0a1a33" roughness={0.9} />
      </mesh>
    </group>
  );
}
