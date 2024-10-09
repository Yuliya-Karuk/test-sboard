export type Point = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type Rect = {
  position: Point;
  size: Size;
};

export type ConnectionPoint = {
  point: Point;
  angle: number;
};

export function checkConnectionPoint(rect: Rect, cPoint: ConnectionPoint): boolean {
  const { position, size } = rect;
  const halfWidth = size.width / 2;
  const halfHeight = size.height / 2;

  const topEdgeY = position.y - halfHeight;
  const bottomEdgeY = position.y + halfHeight;
  const leftEdgeX = position.x - halfWidth;
  const rightEdgeX = position.x + halfWidth;

  const point = cPoint.point;

  if (point.y === topEdgeY && point.x >= leftEdgeX && point.x <= rightEdgeX) {
    return cPoint.angle === 90;
  }

  if (point.y === bottomEdgeY && point.x >= leftEdgeX && point.x <= rightEdgeX) {
    return cPoint.angle === 270;
  }

  if (point.x === leftEdgeX && point.y >= topEdgeY && point.y <= bottomEdgeY) {
    return cPoint.angle === 180;
  }

  if (point.x === rightEdgeX && point.y >= topEdgeY && point.y <= bottomEdgeY) {
    return cPoint.angle === 0;
  }

  return false;
}


const offset = 10;

function offsetPoint(point: Point, angle: number, offset: number): Point {
  let offsetPoint = { ...point };

  if (angle === 90) {
    offsetPoint.y -= offset;
  } else if (angle === 270) {
    offsetPoint.y += offset;
  } else if (angle === 0) {
    offsetPoint.x += offset;
  } else if (angle === 180) {
    offsetPoint.x -= offset;
  }

  return offsetPoint;
}

export function buildPath(rect1: Rect, cPoint1: ConnectionPoint, rect2: Rect, cPoint2: ConnectionPoint): Point[] {
  if (!checkConnectionPoint(rect1, cPoint1)) {
    throw new Error('ConnectionPoint1 не перпендикулярно и наружу относительно rect1');
  }

  if (!checkConnectionPoint(rect2, cPoint2)) {
    throw new Error('ConnectionPoint2 не перпендикулярно и наружу относительно rect2');
  }

  const offsetPoint1 = offsetPoint(cPoint1.point, cPoint1.angle, offset);
  const offsetPoint2 = offsetPoint(cPoint2.point, cPoint2.angle, offset);

  if ((cPoint1.angle === 90 && cPoint2.angle === 270) || (cPoint1.angle === 0 && cPoint2.angle === 180)) {
    const addX = Math.abs((cPoint1.point.x - cPoint2.point.x) / 2) + cPoint1.point.x;
    const path: Point[] = [cPoint1.point, offsetPoint1, { x: addX, y: offsetPoint1.y }, { x: addX, y: offsetPoint2.y }, offsetPoint2, cPoint2.point];

    return path;
  }

  if (cPoint1.angle === 180 && cPoint2.angle === 0) {
    const addY = Math.abs((cPoint1.point.y - cPoint2.point.y) / 2) + cPoint1.point.y;
    const path: Point[] = [cPoint1.point, offsetPoint1, { x: offsetPoint1.x, y: addY }, { x: offsetPoint2.x, y: addY }, offsetPoint2, cPoint2.point];

    return path;
  }

  if ((cPoint1.angle === 90 || cPoint1.angle === 270) && cPoint2.angle === 90) {
    const path: Point[] = [cPoint1.point, offsetPoint1, { x: cPoint2.point.x, y: offsetPoint1.y }, offsetPoint2, cPoint2.point];

    return path;
  }

  if ((cPoint1.angle === 270 && cPoint2.angle === 270) || (cPoint1.angle === 180 && (cPoint2.angle === 90 || cPoint2.angle === 270 || cPoint2.angle === 180))) {
    const path: Point[] = [cPoint1.point, offsetPoint1, { x: offsetPoint1.x, y: offsetPoint2.y }, offsetPoint2, cPoint2.point];

    return path;
  }

  if ((cPoint1.angle === 90 && (cPoint2.angle === 0 || cPoint2.angle === 180)) || (cPoint1.angle === 270 && cPoint2.angle === 0) || (cPoint1.angle === 0 && cPoint2.angle === 90) || (cPoint1.angle === 0 && cPoint2.angle === 0)) {
    const path: Point[] = [cPoint1.point, offsetPoint1, { x: offsetPoint2.x, y: offsetPoint1.y }, offsetPoint2, cPoint2.point];

    return path;
  }

  if ((cPoint1.angle === 270 && cPoint2.angle === 180) || (cPoint1.angle === 0 && cPoint2.angle === 270)) {
    const path: Point[] = [cPoint1.point, offsetPoint1, { x: offsetPoint1.x, y: offsetPoint2.y }, offsetPoint2, cPoint2.point];

    return path;
  }

  throw new Error('Случай соединения не учтен');
}


// export const dataConverter = (
//   rect1: Rect,
//   rect2: Rect,
//   cPoint1: ConnectionPoint,
//   cPoint2: ConnectionPoint
// ): Point[] => {
//   if (!checkConnectionPoint(rect1, cPoint1)) {
//     throw new Error('ConnectionPoint1 не перпендикулярно и наружу относительно rect1');
//   }

//   if (!checkConnectionPoint(rect2, cPoint2)) {
//     throw new Error('ConnectionPoint2 не перпендикулярно и наружу относительно rect2');
//   }

//   return [cPoint1.point, cPoint2.point];
// };