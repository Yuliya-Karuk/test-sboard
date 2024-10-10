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

const find2PointsInTheMiddleY = (cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point) => {
  const addY = Math.abs((cPoint1.point.y - cPoint2.point.y) / 2) + (cPoint1.point.y > cPoint2.point.y ? cPoint2.point.y : cPoint1.point.y);

  return [{x: offsetPoint1.x, y: addY}, {x: offsetPoint2.x, y: addY}]
}

const find2PointsInTheMiddleX = (cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point) => {
  const addX = Math.abs((cPoint1.point.x - cPoint2.point.x) / 2) + (cPoint1.point.x > cPoint2.point.x ? cPoint2.point.x : cPoint1.point.x);

  return [{ x: addX, y: offsetPoint1.y }, { x: addX, y: offsetPoint2.y }];
}

const find2PointsOnLineY = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point) => {
  const addY = cPoint1.point.y + (rect1.size.height > rect2.size.height ? rect1.size.height/2 + offset : rect2.size.height/2 + offset);

  return [{x: offsetPoint1.x, y: addY}, {x: offsetPoint2.x, y: addY}]
}

const find2PointsOnLineX = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point) => {
  const addX = cPoint1.point.x + (rect1.size.width > rect2.size.width ? rect1.size.width/2 + offset : rect2.size.width/2 + offset);

  return [{ x: addX, y: offsetPoint1.y }, { x: addX, y: offsetPoint2.y }]
}

const find1PointConnectOffset2X = (offsetPoint1: Point, offsetPoint2: Point) => {
  const add = { x: offsetPoint1.x, y: offsetPoint2.y}

  return add;
}

const find1PointConnectOffset2Y = (offsetPoint1: Point, offsetPoint2: Point) => {
  const add = { x: offsetPoint2.x, y: offsetPoint1.y}

  return add;
}

const maxXminY = (offsetPoint1: Point, offsetPoint2: Point) => {
  const addPoint: Point = { x: Math.max(offsetPoint2.x, offsetPoint1.x), y: Math.min(offsetPoint2.y, offsetPoint1.y)};
  return addPoint;
}

const minXminY = (offsetPoint1: Point, offsetPoint2: Point) => {
  const addPoint = { x: Math.min(offsetPoint2.x, offsetPoint1.x), y: Math.min(offsetPoint2.y, offsetPoint1.y)};
  return addPoint;
}

const minXmaxY = (offsetPoint1: Point, offsetPoint2: Point) => {
  const addPoint = { x: Math.min(offsetPoint2.x, offsetPoint1.x), y: Math.max(offsetPoint2.y, offsetPoint1.y)};
  return addPoint;
}

const maxXmaxY = (offsetPoint1: Point, offsetPoint2: Point) => {
  const addPoint = { x: Math.max(offsetPoint2.x, offsetPoint1.x), y: Math.max(offsetPoint2.y, offsetPoint1.y)};
  return addPoint;
}

const build90To90 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.x === rect2.position.x) {
    const added = find2PointsOnLineX(rect1, rect2, cPoint1, offsetPoint1, offsetPoint2)

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else if (rect1.position.y === rect2.position.y) {
    path = [cPoint1.point, offsetPoint1, offsetPoint2, cPoint2.point];
  } else if (rect1.position.y < rect2.position.y) {
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    const added = find2PointsInTheMiddleX(cPoint1, cPoint2, offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build90To0 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];
  let addPoint: Point;

  if (rect1.position.x === rect2.position.x) {
    const addX = find2PointsOnLineX(rect1, rect2, cPoint1, offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, ...addX, offsetPoint2, cPoint2.point];
    return path;
  } else if (rect1.position.x > rect2.position.x && rect1.position.y > rect2.position.y) {
    addPoint = minXmaxY(offsetPoint1, offsetPoint2);
  } else if (rect1.position.x < rect2.position.x && rect1.position.y > rect2.position.y) {
    addPoint = maxXmaxY(offsetPoint1, offsetPoint2);
  } else if (rect1.position.x > rect2.position.x && rect1.position.y <= rect2.position.y) {
    addPoint = minXminY(offsetPoint1, offsetPoint2);
  } else if (rect1.position.x < rect2.position.x && rect1.position.y <= rect2.position.y) {
    addPoint = maxXminY(offsetPoint1, offsetPoint2);
  }

  path = [cPoint1.point, offsetPoint1, addPoint, offsetPoint2, cPoint2.point];

  return path;
}

const build90To270 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
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

const build90To180 = (cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  const path: Point[] = [cPoint1.point, offsetPoint1, { x: offsetPoint2.x, y: offsetPoint1.y }, offsetPoint2, cPoint2.point];

  return path;
}


const build0To90 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];
  let addPoint: Point;

    if (rect1.position.x >= rect2.position.x && rect1.position.y >= rect2.position.y) {
      addPoint = maxXminY(offsetPoint1, offsetPoint2);
    } else if (rect1.position.x < rect2.position.x && rect1.position.y >= rect2.position.y) {
      addPoint = minXminY(offsetPoint1, offsetPoint2);
    } else if (rect1.position.x >= rect2.position.x && rect1.position.y < rect2.position.y) {
      addPoint = maxXmaxY(offsetPoint1, offsetPoint2);
    } else if (rect1.position.x < rect2.position.x && rect1.position.y < rect2.position.y) {
      addPoint = minXmaxY(offsetPoint1, offsetPoint2);
    }

    path = [cPoint1.point, offsetPoint1, addPoint, offsetPoint2, cPoint2.point];
    return path;
}

const build0To0 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

    if (rect1.position.y === rect2.position.y) {
      const added = find2PointsOnLineY(rect1, rect2, cPoint1, offsetPoint1, offsetPoint2)

      path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
    } else if (rect1.position.x > rect2.position.x ) {
      const added = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

      path = [cPoint1.point, offsetPoint1, added, offsetPoint2, cPoint2.point];
    } else if (rect1.position.x === rect2.position.x ) {
      path = [cPoint1.point, offsetPoint1, offsetPoint2, cPoint2.point];
    } else {
      const added = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

      path = [cPoint1.point, offsetPoint1, added, offsetPoint2, cPoint2.point];
    }

    return path;
}

const build0To270 = (cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  const path: Point[] = [cPoint1.point, offsetPoint1, { x: offsetPoint1.x, y: offsetPoint2.y }, offsetPoint2, cPoint2.point];

  return path;
}

const build0To180 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
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

const build270To90 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.x === rect2.position.x && rect1.position.y < rect2.position.y) {
    path = [cPoint1.point, offsetPoint1, offsetPoint2, cPoint2.point];
  } else if (rect1.position.x === rect2.position.x && rect1.position.y > rect2.position.y) {
    const added = find2PointsOnLineX(rect1, rect2, cPoint1, offsetPoint1, offsetPoint2)

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else if (rect1.position.y > rect2.position.y) {
    const added = find2PointsInTheMiddleX(cPoint1, cPoint2, offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else {
    path = [cPoint1.point, offsetPoint1, { x: offsetPoint1.x, y: offsetPoint2.y }, offsetPoint2, cPoint2.point];
  }
  return path;
}

const build270To0 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.x > rect2.position.x && rect1.position.y < rect2.position.y) {
    const addX = find1PointConnectOffset2X(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    path =  [cPoint1.point, offsetPoint1, { x: offsetPoint2.x, y: offsetPoint1.y }, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build270To270 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  let path: Point[];

  if (rect1.position.x === rect2.position.x) {
    const added = find2PointsOnLineX(rect1, rect2, cPoint1, offsetPoint1, offsetPoint2)

    path = [cPoint1.point, offsetPoint1, ...added, offsetPoint2, cPoint2.point];
  } else if (rect1.position.y > rect2.position.y) {
    const addX = find1PointConnectOffset2Y(offsetPoint1, offsetPoint2);

    path = [cPoint1.point, offsetPoint1, addX, offsetPoint2, cPoint2.point];
  } else {
    path = [cPoint1.point, offsetPoint1, { x: offsetPoint1.x, y: offsetPoint2.y }, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build270To180 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
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

const build180To90 = (cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
  const path: Point[] = [cPoint1.point, offsetPoint1, { x: offsetPoint1.x, y: offsetPoint2.y }, offsetPoint2, cPoint2.point];

  return path;
}

const build180To0 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
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

const build180To270 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
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
    path = [cPoint1.point, offsetPoint1, { x: offsetPoint1.x, y: offsetPoint2.y }, offsetPoint2, cPoint2.point];
  }

  return path;
}

const build180To180 = (rect1: Rect, rect2: Rect, cPoint1: ConnectionPoint,cPoint2: ConnectionPoint, offsetPoint1: Point, offsetPoint2: Point): Point[] => {
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
    path = [cPoint1.point, offsetPoint1, { x: offsetPoint1.x, y: offsetPoint2.y }, offsetPoint2, cPoint2.point];
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
    return build90To180(cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 0 && cPoint2.angle === 90) {
    return build0To90(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 0 && cPoint2.angle === 0) {
    return build0To0(rect1, rect2, cPoint1, cPoint2, offsetPoint1, offsetPoint2);
  }

  if (cPoint1.angle === 0 && cPoint2.angle === 270) {
    return build0To270(cPoint1, cPoint2, offsetPoint1, offsetPoint2);
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
    return build180To90(cPoint1, cPoint2, offsetPoint1, offsetPoint2);
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
