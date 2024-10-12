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

const offset = 5;

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

function checkRectOverlap(rect1: Rect, rect2: Rect): boolean | Error {
  const moreThanOffset = 6;
  const bounds1 = calculateBounds(rect1);
  const bounds2 = calculateBounds(rect2);

  const isOverlapping = !(bounds1.right < bounds2.left ||
                          bounds1.left > bounds2.right ||
                          bounds1.bottom < bounds2.top ||
                          bounds1.top > bounds2.bottom);

  if (isOverlapping) {
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
    throw new Error("Прямоугольники находятся слишком близко (<= 10px)");
  }

  return true;
}

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

const find2PointsInTheMiddleY = (cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point) => {
  const addY = Math.abs((cPoint1.point.y - cPoint2.point.y) / 2) + (cPoint1.point.y > cPoint2.point.y ? cPoint2.point.y : cPoint1.point.y);

  return [{ x: offsetPoint1.x, y: addY }, { x: offsetPoint2.x, y: addY }]
}

const find2PointsInTheMiddleX = (cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point) => {
  const addX = Math.abs((cPoint1.point.x - cPoint2.point.x) / 2) + (cPoint1.point.x > cPoint2.point.x ? cPoint2.point.x : cPoint1.point.x);

  return [{ x: addX, y: offsetPoint1.y }, { x: addX, y: offsetPoint2.y }];
}

const find2PointsOnLineY = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point) => {
  const addY = cPoint1.point.y + (rect1.size.height > rect2.size.height ? rect1.size.height / 2 + offset : rect2.size.height / 2 + offset);

  return [{ x: offsetPoint1.x, y: addY }, { x: offsetPoint2.x, y: addY }]
}

const find2PointsOnLineX = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point) => {
  const addX = cPoint1.point.x + (rect1.size.width > rect2.size.width ? rect1.size.width / 2 + offset : rect2.size.width / 2 + offset);

  return [{ x: addX, y: offsetPoint1.y }, { x: addX, y: offsetPoint2.y }]
}

const find2PointsToUp = (rect1: Rect, rect2: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const rect1X = rect1.position.x + rect1.size.width / 2;
  const rect2X = rect2.position.x + rect2.size.width / 2;

  const addX = rect1X > rect2X ? rect1X + offset : rect2X + offset
  return [{ x: addX, y: offsetPoint1.y }, { x: addX, y: offsetPoint2.y }]
}

const find1PointConnectOffset2X = (offsetPoint1: Point, offsetPoint2: Point) => {
  const add = { x: offsetPoint1.x, y: offsetPoint2.y }

  return add;
}

const find1PointConnectOffset2Y = (offsetPoint1: Point, offsetPoint2: Point) => {
  const add = { x: offsetPoint2.x, y: offsetPoint1.y }

  return add;
}

const build90To90 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (cPoint1.point.x === cPoint2.point.x) {
    const added = find2PointsOnLineX(rect1, rect2, cPoint1, offsetPoint1, offsetPoint2)

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else if (cPoint1.point.y === cPoint2.point.y) {
    path = [cPoint1.point, offsetPoint1, offsetPoint2, cPoint2.point];
  } else if (cPoint1.point.y < cPoint2.point.y) {
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    const added = find2PointsToUp(rect1, rect2, offsetPoint1, offsetPoint2)

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build90To0 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.x === rect2.position.x) {
    const addX = find2PointsOnLineX(rect1, rect2, cPoint1, offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, ...addX, offsetPoint2, cPoint2.point];
  } else if (rect1.position.x > rect2.position.x && rect1.position.y > rect2.position.y) {
    const addX = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build90To270 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.x === rect2.position.x && rect1.position.y > rect2.position.y) {
    path = [cPoint1.point, offsetPoint1, offsetPoint2, cPoint2.point];
  } else if (rect1.position.x === rect2.position.x && rect1.position.y < rect2.position.y) {
    const added = find2PointsOnLineX(rect1, rect2, cPoint1, offsetPoint1, offsetPoint2)

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else if (rect1.position.y <= rect2.position.y) {
    const added = find2PointsInTheMiddleX(cPoint1, cPoint2, offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else {
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build90To180 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];
  if (rect1.position.x < rect2.position.x && rect1.position.y > rect2.position.y) {
    const addX = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  }

  return path;
}


const build0To90 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];


  if (rect1.position.x < rect2.position.x && rect1.position.y < rect2.position.y) {
    console.log('shhsh')
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    const addX = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build0To0 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.y === rect2.position.y) {
    const added = find2PointsOnLineY(rect1, rect2, cPoint1, offsetPoint1, offsetPoint2)

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else if (rect1.position.x > rect2.position.x) {
    const added = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, added, offsetPoint2, cPoint2.point];
  } else if (rect1.position.x === rect2.position.x) {
    path = [cPoint1.point, offsetPoint1, offsetPoint2, cPoint2.point];
  } else {
    const added = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, added, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build0To270 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.x < rect2.position.x && rect1.position.y > rect2.position.y) {
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    const addX = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build0To180 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.y === rect2.position.y && rect1.position.x < rect2.position.x) {
    path = [cPoint1.point, offsetPoint1, offsetPoint2, cPoint2.point];
  } else if (rect1.position.y === rect2.position.y && rect1.position.x > rect2.position.x) {
    const added = find2PointsOnLineY(rect1, rect2, cPoint1, offsetPoint1, offsetPoint2)

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else if (rect1.position.x >= rect2.position.x) {
    const added = find2PointsInTheMiddleY(cPoint1, cPoint2, offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else {
    const added = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, added, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build270To90 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.x === rect2.position.x && rect1.position.y < rect2.position.y) {
    path = [cPoint1.point, offsetPoint1, offsetPoint2, cPoint2.point];
  } else if (rect1.position.x === rect2.position.x && rect1.position.y > rect2.position.y) {
    const added = find2PointsOnLineX(rect1, rect2, cPoint1, offsetPoint1, offsetPoint2)

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else if (rect1.position.y >= rect2.position.y) {
    const added = find2PointsInTheMiddleX(cPoint1, cPoint2, offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else {
    const added = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, added, offsetPoint2, cPoint2.point];
  }
  return path;
}

const build270To0 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.x > rect2.position.x && rect1.position.y < rect2.position.y) {
    const addX = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    const added = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, added, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build270To270 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.x === rect2.position.x) {
    const added = find2PointsOnLineX(rect1, rect2, cPoint1, offsetPoint1, offsetPoint2)

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else if (rect1.position.y > rect2.position.y) {
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    const added = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, added, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build270To180 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.x === rect2.position.x) {
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else if (rect1.position.x < rect2.position.x && rect1.position.y < rect2.position.y) {
    const addX = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else if (rect1.position.y < rect2.position.y) {
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build180To90 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];
  if (rect1.position.x > rect2.position.x && rect1.position.y < rect2.position.y) {
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    const added = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, added, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build180To0 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.x > rect2.position.x && rect1.position.y === rect2.position.y) {
    path = [cPoint1.point, offsetPoint1, offsetPoint2, cPoint2.point];
  } else if (rect1.position.x < rect2.position.x && rect1.position.y === rect2.position.y) {
    const added = find2PointsOnLineY(rect1, rect2, cPoint1, offsetPoint1, offsetPoint2)

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else if (rect1.position.x > rect2.position.x) {
    const addX = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    const added = find2PointsInTheMiddleY(cPoint1, cPoint2, offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build180To270 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.x === rect2.position.x && rect1.position.y > rect2.position.y) {
    const added = find2PointsInTheMiddleY(cPoint1, cPoint2, offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else if (rect1.position.x === rect2.position.x && rect1.position.y < rect2.position.y) {
    const addX = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else if (rect1.position.x > rect2.position.x && rect1.position.y > rect2.position.y) {
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    const added = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, added, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build180To180 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.x === rect2.position.x) {
    const added = find2PointsInTheMiddleY(cPoint1, cPoint2, offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else if (rect1.position.y === rect2.position.y) {
    const added = find2PointsOnLineY(rect1, rect2, cPoint1, offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else if (rect1.position.x > rect2.position.x) {
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    const added = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, added, offsetPoint2, cPoint2.point];
  }
  return path;
}

export function buildPath(rect1: Rect, cPoint1: ConnectionPoint, rect2: Rect, cPoint2: ConnectionPoint): Point[] {
  if (!checkConnectionPoint(rect1, cPoint1)) {
    throw new Error('ConnectionPoint1 не перпендикулярно и наружу относительно rect1');
  }

  if (!checkConnectionPoint(rect2, cPoint2)) {
    throw new Error('ConnectionPoint2 не перпендикулярно и наружу относительно rect2');
  }

  if (!checkRectOverlap(rect1, rect2)) {
    throw new Error("Прямоугольники находятся слишком близко (менее или равно 10px) или Прямоугольники перекрываются");
  }

  const offsetPoint1 = offsetPoint(cPoint1.point, cPoint1.angle, offset);
  const offsetPoint2 = offsetPoint(cPoint2.point, cPoint2.angle, offset);

  if (cPoint1.angle === 90 && cPoint2.angle === 90) {
    return build90To90(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 90 && cPoint2.angle === 0) {
    return build90To0(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 90 && cPoint2.angle === 270) {
    return build90To270(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 90 && cPoint2.angle === 180) {
    return build90To180(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 0 && cPoint2.angle === 90) {
    return build0To90(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 0 && cPoint2.angle === 0) {
    return build0To0(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 0 && cPoint2.angle === 270) {
    return build0To270(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 0 && cPoint2.angle === 180) {
    return build0To180(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 270 && cPoint2.angle === 90) {
    return build270To90(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 270 && cPoint2.angle === 0) {
    return build270To0(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 270 && cPoint2.angle === 270) {
    return build270To270(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 270 && cPoint2.angle === 180) {
    return build270To180(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 180 && cPoint2.angle === 90) {
    return build180To90(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 180 && cPoint2.angle === 0) {
    return build180To0(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 180 && cPoint2.angle === 270) {
    return build180To270(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 180 && cPoint2.angle === 180) {
    return build180To180(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  throw new Error('Случай соединения не учтен');
}
