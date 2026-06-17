"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { cameraStops } from "@/components/home/camera-stops";
import { homeScrollOffset } from "@/components/home/scroll-store";
import { remapRailProgress, getTransitionVeil } from "@/components/home/scroll-rail";
import { easeInOutCubic, lerp } from "@/lib/easing";

function sampleCameraAt(t: number) {
  const max = cameraStops.length - 1;
  const scaled = t * max;
  const i = Math.min(Math.floor(scaled), max - 1);
  const f = easeInOutCubic(scaled - i);
  const a = cameraStops[i];
  const b = cameraStops[i + 1];

  return {
    position: [
      lerp(a.position[0], b.position[0], f),
      lerp(a.position[1], b.position[1], f),
      lerp(a.position[2], b.position[2], f),
    ] as [number, number, number],
    target: [
      lerp(a.target[0], b.target[0], f),
      lerp(a.target[1], b.target[1], f),
      lerp(a.target[2], b.target[2], f),
    ] as [number, number, number],
  };
}

export function CameraRig() {
  const { camera } = useThree();
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const baseFov = useMemo(() => {
    if (camera instanceof THREE.PerspectiveCamera) return camera.fov;
    return 50;
  }, [camera]);

  useFrame((_, delta) => {
    const railT = remapRailProgress(homeScrollOffset.current);
    const { position, target } = sampleCameraAt(railT);
    const veil = getTransitionVeil(homeScrollOffset.current);

    desired.set(position[0], position[1], position[2]);
    lookAt.set(target[0], target[1], target[2]);

    const punch = 1 - Math.pow(0.0005, delta);
    camera.position.lerp(desired, punch);
    camera.up.copy(up);
    camera.lookAt(lookAt);

    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = baseFov + veil * 14;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, punch);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
