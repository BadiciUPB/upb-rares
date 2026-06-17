"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraRig } from "@/components/home/CameraRig";
import { AcademicCore } from "@/components/home/three/AcademicCore";
import { LaptopAdmitereMock } from "@/components/home/three/LaptopAdmitereMock";
import { Hallway } from "@/components/home/three/Hallway";

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[0, 5, 6]} intensity={0.35} color="#93c5fd" />
      <fog attach="fog" args={["#020617", 8, 30]} />
    </>
  );
}

function WorldScene() {
  return (
    <>
      <CameraRig />
      <SceneLights />
      <Hallway />
      <AcademicCore />
      <LaptopAdmitereMock />
    </>
  );
}

function CanvasFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0a1a33] to-[#020617]" />
  );
}

export function SceneCanvas() {
  return (
    <div className="fixed inset-0 z-0">
      <Suspense fallback={<CanvasFallback />}>
        <Canvas
          camera={{ position: [0, 1.72, 5], fov: 52, near: 0.1, far: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={["#020617"]} />
          <WorldScene />
        </Canvas>
      </Suspense>
    </div>
  );
}
