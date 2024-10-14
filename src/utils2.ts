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

const goAroundRect2 = (rect2: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const leftEdge = rect2.position.x - rect2.size.width / 2;
  const rightEdge = rect2.position.x + rect2.size.width / 2;

  if (leftEdge <= offsetPoint1.x && offsetPoint1.x <= rightEdge) {
    const diffToLeft = Math.abs(offsetPoint1.x - leftEdge);
    const diffToRight = Math.abs(offsetPoint1.x - rightEdge);
    const neededDiff = diffToLeft > diffToRight ? diffToRight + offset : -diffToLeft - offset;

    console.log(diffToLeft, diffToRight);
    const add1 = { x: offsetPoint1.x + neededDiff, y: offsetPoint1.y };
    const add2 = { x: offsetPoint1.x + neededDiff, y: offsetPoint2.y };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint1.x, y: offsetPoint2.y };
  return [add1];
}

const findTheNearestEdgeByXAndGoAroundItBy2 = (rect1: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const leftEdge = rect1.position.x - rect1.size.width / 2;
  const rightEdge = rect1.position.x + rect1.size.width / 2;

  if (leftEdge <= offsetPoint2.x && offsetPoint2.x <= rightEdge) {
    return [{ x: rightEdge + offset, y: offsetPoint1.y }, { x: rightEdge + offset, y: offsetPoint2.y }];
  }

  const add1 = { x: offsetPoint2.x, y: offsetPoint1.y };;
  return [add1];
}

const goFromLeftToTop = (rect2: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const leftEdge = rect2.position.x - rect2.size.width / 2;
  const rightEdge = rect2.position.x + rect2.size.width / 2;

  if (leftEdge <= offsetPoint1.x && offsetPoint1.x <= rightEdge) {
    const diffToLeft = Math.abs(offsetPoint1.x - leftEdge);
    const neededDiff = -diffToLeft - offset;

    const add1 = { x: offsetPoint1.x + neededDiff, y: offsetPoint1.y };
    const add2 = { x: offsetPoint1.x + neededDiff, y: offsetPoint2.y };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint1.x, y: offsetPoint2.y };
  return [add1];
}

const goFromRightToTop = (rect2: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const leftEdge = rect2.position.x - rect2.size.width / 2;
  const rightEdge = rect2.position.x + rect2.size.width / 2;

  if (leftEdge <= offsetPoint1.x && offsetPoint1.x <= rightEdge) {
    const diffToRight = Math.abs(offsetPoint1.x - rightEdge);
    const neededDiff = diffToRight + offset;

    const add1 = { x: offsetPoint1.x + neededDiff, y: offsetPoint1.y };
    const add2 = { x: offsetPoint1.x + neededDiff, y: offsetPoint2.y };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint1.x, y: offsetPoint2.y };
  return [add1];
}

const goAroundRight2 = (rect1: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const leftEdge = rect1.position.x - rect1.size.width / 2;
  const rightEdge = rect1.position.x + rect1.size.width / 2;

  if (rightEdge > offsetPoint2.x && offsetPoint2.x > leftEdge) {
    const add1 = { x: offsetPoint1.x - rect1.size.width / 2 - offset, y: offsetPoint1.y };
    const add2 = { x: offsetPoint1.x - rect1.size.width / 2 - offset, y: offsetPoint2.y };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint2.x, y: offsetPoint1.y };
  return [add1];
}

const goAroundRect1ByY = (rect1: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const leftEdge = rect1.position.x - rect1.size.width / 2;
  const rightEdge = rect1.position.x + rect1.size.width / 2;

  if (rightEdge > offsetPoint2.x && offsetPoint2.x > leftEdge) {
    const add1 = { x: offsetPoint1.x - rect1.size.width / 2 - offset, y: offsetPoint1.y };
    const add2 = { x: offsetPoint1.x - rect1.size.width / 2 - offset, y: offsetPoint2.y };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint2.x, y: offsetPoint1.y };
  return [add1];
}

function calculateSegmentLength(points: Point[]) {
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

const goAroundTwoRect = (rect1: Rect, rect2: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const leftEdgeRect1 = rect1.position.x - rect1.size.width / 2;
  const rightEdgeRect1 = rect1.position.x + rect1.size.width / 2;

  const leftEdgeRect2 = rect2.position.x - rect2.size.width / 2;
  const rightEdgeRect2 = rect2.position.x + rect2.size.width / 2;

  const mostLeft = leftEdgeRect1 > leftEdgeRect2 ? leftEdgeRect2 : leftEdgeRect1;
  const mostRight = rightEdgeRect1 > rightEdgeRect2 ? rightEdgeRect1 : rightEdgeRect2
  const leftPoints = [{ x: mostLeft - offset, y: offsetPoint1.y }, { x: mostLeft - offset, y: offsetPoint2.y }];
  const rightPoints = [{ x: mostRight + offset, y: offsetPoint1.y }, { x: mostRight + offset, y: offsetPoint2.y }];

  if (offsetPoint1.x === offsetPoint2.x) {
    return rightPoints;
  }

  if (rightEdgeRect2 + offset < leftEdgeRect1 - offset) {
    const add1 = { x: offsetPoint2.x + rect2.size.width / 2 + offset, y: offsetPoint1.y };
    const add2 = { x: offsetPoint2.x + rect2.size.width / 2 + offset, y: offsetPoint2.y };
    return [add1, add2];
  }

  if (leftEdgeRect2 - offset > rightEdgeRect1 + offset) {
    const add1 = { x: offsetPoint2.x - rect2.size.width / 2 - offset, y: offsetPoint1.y };
    const add2 = { x: offsetPoint2.x - rect2.size.width / 2 - offset, y: offsetPoint2.y };
    return [add1, add2];
  }

  const leftPath = calculateSegmentLength([offsetPoint1, ...leftPoints, offsetPoint2]);
  const rightPath = calculateSegmentLength([offsetPoint1, ...rightPoints, offsetPoint2])
  return leftPath >= rightPath ? rightPoints :leftPoints;
}

const addPoint1XPoint2Y = (offsetPoint1: Point, offsetPoint2: Point) => {
  return [{ x: offsetPoint1.x, y: offsetPoint2.y }];
}

const addPoint1YPoint2X = (offsetPoint1: Point, offsetPoint2: Point) => {
  return [{ x: offsetPoint2.x, y: offsetPoint1.y }];
}

const find2PointsInTheMiddleY = (offsetPoint1: Point, offsetPoint2: Point) => {
  const addY = Math.abs((offsetPoint1.y - offsetPoint2.y) / 2) + (offsetPoint1.y > offsetPoint2.y ? offsetPoint2.y : offsetPoint1.y);

  return [{ x: offsetPoint1.x, y: addY }, { x: offsetPoint2.x, y: addY }]
}

const goAroundRect1 = (rect1: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const leftEdge = rect1.position.x - rect1.size.width / 2;
  const rightEdge = rect1.position.x + rect1.size.width / 2;

  if (rightEdge > offsetPoint2.x && offsetPoint2.x > leftEdge) {
    const diffToLeft = Math.abs(offsetPoint2.x - leftEdge);
    const diffToRight = Math.abs(offsetPoint2.x - rightEdge);
    const neededDiff = diffToLeft > diffToRight ? diffToRight + offset : -diffToLeft - offset;

    console.log(diffToLeft, diffToRight);
    const add1 = { x: offsetPoint1.x + neededDiff, y: offsetPoint1.y };
    const add2 = { x: offsetPoint1.x + neededDiff, y: offsetPoint2.y };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint2.x, y: offsetPoint1.y };
  return [add1];
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

  if (cPoint1.point.x === cPoint2.point.x && ((cPoint1.angle === 90 && cPoint2.angle === 270 && cPoint1.point.y > cPoint2.point.y) || (cPoint1.angle === 270 && cPoint2.angle === 90 && cPoint1.point.y < cPoint2.point.y))) {
    console.log('1-2');
    return [cPoint1.point, offsetPoint1, offsetPoint2, cPoint2.point];
  }

  if (rect1.position.y - rect1.size.height / 2 - offset > rect2.position.y + rect2.size.height / 2 + offset) {
    if (cPoint1.angle === 180 && cPoint2.angle === 270) {
      let add;
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 90) {
      const add = goFromLeftToTop(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 0) {
      let add;
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = find2PointsInTheMiddleY(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 180) {
      let add;
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 90) {
      console.log('9');
      const add = goAroundRect2(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 180) {
      console.log('10');

      let add;
      if (offsetPoint1.x <= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 0) {
      console.log('11');

      let add;
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 270) {
      console.log('12');
      const add = addPoint1YPoint2X(offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 0) {
      console.log('13');
      const add = findTheNearestEdgeByXAndGoAroundItBy2(rect1, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 180) {
      console.log('14');
      const add = goAroundRight2(rect1, offsetPoint1, offsetPoint2);
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 270) {
      console.log('15');
      const add = goAroundRect1(rect1, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 90) {
      console.log('16');
      const add = goAroundTwoRect(rect1, rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 90) {
      const add = goFromRightToTop(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 270) {
      let add;
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 0) {
      let add;
      if (offsetPoint1.x >= offsetPoint2.x) {
        add =  addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 180) {
      let add;
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = find2PointsInTheMiddleY(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }
  }

  if (rect1.position.y + rect1.size.height / 2 + offset < rect2.position.y - rect2.size.height / 2 - offset) {
    if (cPoint1.angle === 180 && cPoint2.angle === 90) {
      let add;
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 270) {
      const add = goFromLeftToTop(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 0) {
      let add;
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = find2PointsInTheMiddleY(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 180) {
      let add;
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 90) {
      console.log('15');
      const add = goAroundRect1(rect1, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 180) {
      console.log('14');
      const add = goAroundRight2(rect1, offsetPoint1, offsetPoint2);
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 270) {
      console.log('16');
      const add = goAroundTwoRect(rect1, rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 0) {
      let add;
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 90) {
      let add;
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 270) {
      const add = goFromRightToTop(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 180) {
      let add;
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = find2PointsInTheMiddleY(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 180) {
      let add;
      if (offsetPoint1.x <= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 270) {
      console.log('9');
      const add = goAroundRect2(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 90) {
      console.log('12');
      const add = addPoint1YPoint2X(offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 0) {
      console.log('11');

      let add;
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }
  }


  if (cPoint1.point.x > cPoint2.point.x) {
    console.log('hshh')
    if (cPoint1.angle === 90 && cPoint2.angle === 0) {
      const add = goFromRightToTop(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }
  }
  // if (offsetPoint1.x < offsetPoint2.x && offsetPoint1.y > offsetPoint2.y &&
  //   cPoint1.angle === 0 && cPoint2.angle === 270) {
  //   console.log('7');
  //   const add = { x: offsetPoint2.x, y: offsetPoint1.y };
  //   return [cPoint1.point, offsetPoint1, add, offsetPoint2, cPoint2.point];
  // }

  // if (offsetPoint1.x < offsetPoint2.x && offsetPoint1.y < offsetPoint2.y &&
  //   cPoint1.angle === 0 && cPoint2.angle === 90) {
  //   console.log('8');
  //   const add = { x: offsetPoint2.x, y: offsetPoint1.y };
  //   return [cPoint1.point, offsetPoint1, add, offsetPoint2, cPoint2.point];
  // }


  // if (offsetPoint1.x > offsetPoint2.x && ((cPoint1.angle === 90 && cPoint2.angle === 270) || (cPoint1.angle === 270 && cPoint2.angle === 90))) {
  //   return [cPoint1.point, offsetPoint1, offsetPoint2, cPoint2.point];
  // }


  // if (cPoint1.point.x === cPoint2.point.x && ((cPoint1.angle === 0 || cPoint1.angle === 180) && (cPoint2.angle === 270 || cPoint2.angle === 90))) {
  //   console.log('sjjsj')
  //   const added = { x: offsetPoint2.x, y: offsetPoint1.y };
  //   return [cPoint1.point, offsetPoint1, added, offsetPoint2, cPoint2.point];
  // }

  // if (cPoint1.point.x === cPoint2.point.x && ((cPoint1.angle === 90 && cPoint2.angle === 90) || (cPoint1.angle === 270 && cPoint2.angle === 270))) {
  //   if (rect1.size.width < rect2.size.width) {
  //     const rect1X = { x: rect1.position.x + rect1.size.width / 2 + offset, y: offsetPoint1.y };
  //     const rect2X = { x: rect2.position.x + rect2.size.width / 2 + offset, y: offsetPoint2.y };
  //     // console.log(rect1X, rect2X);


  //     const add = { x: rect1X.x > rect2X.x ? rect1X.x : rect2X.x, y: rect1X.x > rect2X.x ? offsetPoint2.y : offsetPoint1.y };
  //     return [cPoint1.point, offsetPoint1, rect1X, add, rect2X, offsetPoint2, cPoint2.point];
  //   } else {
  //     const rect1X = { x: rect1.position.x + rect1.size.width / 2 + offset, y: offsetPoint1.y };
  //     const rect2X = { x: rect2.position.x + rect2.size.width / 2 + offset, y: offsetPoint2.y };
  //     // console.log(rect1X, rect2X);


  //     const add = { x: rect1X.x > rect2X.x ? rect1X.x : rect2X.x, y: rect1X.x > rect2X.x ? offsetPoint2.y : offsetPoint1.y };
  //     return [cPoint1.point, offsetPoint1, rect1X, add, rect2X, offsetPoint2, cPoint2.point];
  //   }
  // }

  
  throw new Error('Случай соединения не учтен');
}

