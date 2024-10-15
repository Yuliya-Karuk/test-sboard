import { Point } from "./types";

export function calculateSegmentLength(points: Point[]) {
  let totalLength = 0;

  for (let i = 0; i < points.length - 1; i++) {
    let x1 = points[i].x;
    let y1 = points[i].y;
    let x2 = points[i + 1].x;
    let y2 = points[i + 1].y;

    let distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    totalLength += distance;
  }

  return totalLength;
}
