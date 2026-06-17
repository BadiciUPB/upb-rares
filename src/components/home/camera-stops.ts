export type CameraStop = {
  id: string;
  position: [number, number, number];
  target: [number, number, number];
  overlayRange: [number, number];
};

/** World Z anchors — exhibits sit along the corridor center line. */
export const corridorStations = {
  hero: 0,
  campuses: -6,
  events: -11,
  bulletin: -16,
  laptop: -20,
} as const;

/**
 * Camera rides a straight rail down the corridor (negative Z).
 * Minimal X/Y drift — forward dolly only.
 */
export const cameraStops: CameraStop[] = [
  {
    id: "hero",
    position: [0, 1.72, 5],
    target: [0, 1.25, corridorStations.hero],
    overlayRange: [0, 0.18],
  },
  {
    id: "campuses",
    position: [0, 1.7, -2.5],
    target: [0, 1.2, corridorStations.campuses],
    overlayRange: [0.19, 0.39],
  },
  {
    id: "events",
    position: [0, 1.68, -7.5],
    target: [0, 1.2, corridorStations.events],
    overlayRange: [0.4, 0.59],
  },
  {
    id: "bulletin",
    position: [0, 1.66, -12.5],
    target: [0, 1.15, corridorStations.bulletin],
    overlayRange: [0.6, 0.78],
  },
  {
    id: "admitere-laptop",
    position: [0, 1.62, -17],
    target: [0, 1.1, corridorStations.laptop],
    overlayRange: [0.79, 1],
  },
];
