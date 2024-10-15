import { ConnectionPoint, Rect } from "./types";

export function checkConnectionPoint(rect: Rect, cPoint: ConnectionPoint): boolean {
  const { position, size } = rect;
  const halfWidth = size.width / 2;
  const halfHeight = size.height / 2;

  const topEdgeY = position.y - halfHeight;
  const bottomEdgeY = position.y + halfHeight;
  const leftEdgeX = position.x - halfWidth;
  const rightEdgeX = position.x + halfWidth;

  const point = cPoint.point;

  if (point.y === topEdgeY) {
    return cPoint.angle === 90;
  }

  if (point.y === bottomEdgeY) {
    return cPoint.angle === 270;
  }

  if (point.x === leftEdgeX) {
    return cPoint.angle === 180;
  }

  if (point.x === rightEdgeX) {
    return cPoint.angle === 0;
  }

  return false;
}

function calculateBounds(rect: Rect) {
  const halfWidth = rect.size.width / 2;
  const halfHeight = rect.size.height / 2;

  return {
    left: rect.position.x - halfWidth,
    right: rect.position.x + halfWidth,
    top: rect.position.y - halfHeight,
    bottom: rect.position.y + halfHeight
  };
}

export function checkRectOverlap(rect1: Rect, rect2: Rect): boolean | Error {
  const moreThanOffset = 6;
  const bounds1 = calculateBounds(rect1);
  const bounds2 = calculateBounds(rect2);

  const isOverlapping = !(bounds1.right < bounds2.left ||
    bounds1.left > bounds2.right ||
    bounds1.bottom < bounds2.top ||
    bounds1.top > bounds2.bottom);

  if (isOverlapping) {
    alert("Прямоугольники перекрываются");
    throw new Error("Прямоугольники перекрываются");
  }

  const expandedRect1 = {
    position: rect1.position,
    size: {
      width: rect1.size.width + moreThanOffset,
      height: rect1.size.height + moreThanOffset
    }
  };

  const expandedRect2 = {
    position: rect2.position,
    size: {
      width: rect2.size.width + moreThanOffset,
      height: rect2.size.height + moreThanOffset,
    }
  };

  const expandedBounds1 = calculateBounds(expandedRect1);
  const expandedBounds2 = calculateBounds(expandedRect2);

  const isTooClose = !(expandedBounds1.right < expandedBounds2.left ||
    expandedBounds1.left > expandedBounds2.right ||
    expandedBounds1.bottom < expandedBounds2.top ||
    expandedBounds1.top > expandedBounds2.bottom);


  if (isTooClose) {
    alert("Прямоугольники находятся слишком близко (<= 10px)")
    throw new Error("Прямоугольники находятся слишком близко (<= 10px)");
  }

  return true;
}
