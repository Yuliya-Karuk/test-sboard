import { checkConnectionPoint, checkRectOverlap } from "./utils/checkers";
import { ConnectionPoint, Point, Rect } from "./utils/types";
import { calculateSegmentLength } from "./utils/utils";

const offset = 5;

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

const addPoint1XPoint2Y = (offsetPoint1: Point, offsetPoint2: Point) => {
  return [{ x: offsetPoint1.x, y: offsetPoint2.y }];
}

const addPoint1YPoint2X = (offsetPoint1: Point, offsetPoint2: Point) => {
  return [{ x: offsetPoint2.x, y: offsetPoint1.y }];
}

const goAroundTwoRectX = (rect1: Rect, rect2: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
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
  return leftPath >= rightPath ? rightPoints : leftPoints;
}

const goAroundTwoRectY = (rect1: Rect, rect2: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const topEdgeRect1 = rect1.position.y - rect1.size.height / 2;
  const bottomEdgeRect1 = rect1.position.y + rect1.size.height / 2;

  const topEdgeRect2 = rect2.position.y - rect2.size.height / 2;
  const bottomEdgeRect2 = rect2.position.y + rect2.size.height / 2;

  const mostTop = topEdgeRect1 > topEdgeRect2 ? topEdgeRect2 : topEdgeRect1;
  const mostBottom = bottomEdgeRect1 > bottomEdgeRect2 ? bottomEdgeRect1 : bottomEdgeRect2;
  const topPoints = [{ x: offsetPoint1.x, y: mostTop - offset }, { x: offsetPoint2.x, y: mostTop - offset }];
  const bottomPoints = [{ x: offsetPoint1.x, y: mostBottom + offset }, { x: offsetPoint2.x, y: mostBottom + offset }];

  if (offsetPoint1.x === offsetPoint2.x) {
    return bottomPoints;
  }

  const topPath = calculateSegmentLength([offsetPoint1, ...topPoints, offsetPoint2]);
  const bottomPath = calculateSegmentLength([offsetPoint1, ...bottomPoints, offsetPoint2])
  return topPath >= bottomPath ? bottomPoints : topPoints;
}

const goAroundRect2ByX = (rect2: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const leftEdge = rect2.position.x - rect2.size.width / 2;
  const rightEdge = rect2.position.x + rect2.size.width / 2;

  if (leftEdge <= offsetPoint1.x && offsetPoint1.x <= rightEdge) {
    const diffToLeft = Math.abs(offsetPoint1.x - leftEdge);
    const diffToRight = Math.abs(offsetPoint1.x - rightEdge);
    const neededDiff = diffToLeft > diffToRight ? diffToRight + offset : -diffToLeft - offset;

    const add1 = { x: offsetPoint1.x + neededDiff, y: offsetPoint1.y };
    const add2 = { x: offsetPoint1.x + neededDiff, y: offsetPoint2.y };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint1.x, y: offsetPoint2.y };
  return [add1];
}

const goAroundRect2ByY = (rect2: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const topEdge = rect2.position.y - rect2.size.height / 2;
  const bottomEdge = rect2.position.y + rect2.size.height / 2;

  if (topEdge <= offsetPoint1.y && offsetPoint1.y <= bottomEdge) {
    const diffToTop = Math.abs(offsetPoint1.y - topEdge);
    const diffToBottom = Math.abs(offsetPoint1.y - bottomEdge);
    const neededDiff = diffToTop > diffToBottom ? diffToBottom + offset : -diffToTop - offset;

    const add1 = { x: offsetPoint1.x, y: offsetPoint1.y + neededDiff };
    const add2 = { x: offsetPoint2.x, y: offsetPoint1.y + neededDiff };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint2.x, y: offsetPoint1.y };
  return [add1];
}

const goAroundRect1ByX = (rect1: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const leftEdge = rect1.position.x - rect1.size.width / 2;
  const rightEdge = rect1.position.x + rect1.size.width / 2;

  if (rightEdge > offsetPoint2.x && offsetPoint2.x > leftEdge) {
    const diffToLeft = Math.abs(offsetPoint2.x - leftEdge);
    const diffToRight = Math.abs(offsetPoint2.x - rightEdge);
    const neededDiff = diffToLeft > diffToRight ? diffToRight + offset : -diffToLeft - offset;

    const add1 = { x: offsetPoint2.x + neededDiff, y: offsetPoint1.y };
    const add2 = { x: offsetPoint2.x + neededDiff, y: offsetPoint2.y };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint2.x, y: offsetPoint1.y };
  return [add1];
}

const goAroundRect1ByY = (rect1: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const topEdge = rect1.position.y - rect1.size.height / 2;
  const bottomEdge = rect1.position.y + rect1.size.height / 2;

  if (topEdge - offset < offsetPoint2.y && offsetPoint2.y < bottomEdge + offset) {
    const diffToTop = Math.abs(offsetPoint2.y - topEdge);
    const diffToBottom = Math.abs(offsetPoint2.y - bottomEdge);
    const neededDiff = diffToTop > diffToBottom ? diffToBottom + offset : -diffToTop - offset;

    const add1 = { x: offsetPoint1.x, y: offsetPoint2.y + neededDiff };
    const add2 = { x: offsetPoint2.x, y: offsetPoint2.y + neededDiff };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint1.x, y: offsetPoint2.y };
  return [add1];
}

const goAroundRect2ByYTop = (rect2: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const topEdge = rect2.position.y - rect2.size.height / 2;

  if (topEdge - offset < offsetPoint1.y) {
    const add1 = { x: offsetPoint1.x, y: topEdge - offset };
    const add2 = { x: offsetPoint2.x, y: topEdge - offset };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint2.x, y: offsetPoint1.y };
  return [add1];
}

const goAroundRect2ByYBottom = (rect2: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const bottomEdge = rect2.position.y + rect2.size.height / 2;

  if (bottomEdge + offset > offsetPoint1.y) {
    const add1 = { x: offsetPoint1.x, y: bottomEdge + offset };
    const add2 = { x: offsetPoint2.x, y: bottomEdge + offset };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint2.x, y: offsetPoint1.y };
  return [add1];
}

const findWayBetweenOppositeByX = (rect1: Rect, offsetPoint1: Point, offsetPoint2: Point, isBottom: boolean) => {
  const bottomEdge = rect1.position.y + rect1.size.height / 2;
  const topEdge = rect1.position.y - rect1.size.height / 2;

  if (isBottom) {
    const add1 = { x: offsetPoint1.x, y: bottomEdge + offset };
    const add2 = { x: offsetPoint2.x, y: bottomEdge + offset };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint1.x, y: topEdge - offset };
  const add2 = { x: offsetPoint2.x, y: topEdge - offset };
  return [add1, add2];
}

const findWayBetweenOppositeByY = (rect1: Rect, offsetPoint1: Point, offsetPoint2: Point, isRight: boolean) => {
  const rightEdge = rect1.position.x + rect1.size.width / 2;
  const leftEdge = rect1.position.x - rect1.size.width / 2;

  if (isRight) {
    const add1 = { x: rightEdge + offset, y: offsetPoint1.y };
    const add2 = { x: rightEdge + offset, y: offsetPoint2.y };
    return [add1, add2];
  }

  const add1 = { x: leftEdge - offset, y: offsetPoint1.y };
  const add2 = { x: leftEdge - offset, y: offsetPoint2.y };
  return [add1, add2];
}

const goAroundRect1ByXFrom270to0 = (rect1: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
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

const goAroundRect1ByXFrom270to180 = (rect1: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
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

const goFromRightToTopY = (rect1: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const topEdge = rect1.position.y - rect1.size.height / 2;
  const bottomEdge = rect1.position.y + rect1.size.height / 2;

  if (topEdge <= offsetPoint2.y && offsetPoint2.y <= bottomEdge) {
    const add1 = { x: offsetPoint1.x, y: topEdge - offset };
    const add2 = { x: offsetPoint2.x, y: topEdge - offset };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint1.x, y: offsetPoint2.y };
  return [add1];
}

const goFromRightToBottomY = (rect1: Rect, offsetPoint1: Point, offsetPoint2: Point) => {
  const topEdge = rect1.position.y - rect1.size.height / 2;
  const bottomEdge = rect1.position.y + rect1.size.height / 2;

  if (topEdge <= offsetPoint2.y && offsetPoint2.y <= bottomEdge) {
    const add1 = { x: offsetPoint1.x, y: bottomEdge + offset };
    const add2 = { x: offsetPoint2.x, y: bottomEdge + offset };
    return [add1, add2];
  }

  const add1 = { x: offsetPoint1.x, y: offsetPoint2.y };
  return [add1];
}

export function dataConverter(rect1: Rect, cPoint1: ConnectionPoint, rect2: Rect, cPoint2: ConnectionPoint): Point[] {
  if (!checkConnectionPoint(rect1, cPoint1)) {
    alert('ConnectionPoint1 не перпендикулярно и наружу относительно rect1')
    throw new Error('ConnectionPoint1 не перпендикулярно и наружу относительно rect1');
  }

  if (!checkConnectionPoint(rect2, cPoint2)) {
    alert('ConnectionPoint2 не перпендикулярно и наружу относительно rect2')
    throw new Error('ConnectionPoint2 не перпендикулярно и наружу относительно rect2');
  }

  checkRectOverlap(rect1, rect2);

  const offsetPoint1 = offsetPoint(cPoint1.point, cPoint1.angle, offset);
  const offsetPoint2 = offsetPoint(cPoint2.point, cPoint2.angle, offset);

  let add;

  if (cPoint1.point.x === cPoint2.point.x && ((cPoint1.angle === 90 && cPoint2.angle === 270 && cPoint1.point.y > cPoint2.point.y) || (cPoint1.angle === 270 && cPoint2.angle === 90 && cPoint1.point.y < cPoint2.point.y))) {
    return [cPoint1.point, offsetPoint1, offsetPoint2, cPoint2.point];
  }

  if (rect1.position.y - rect1.size.height / 2 - offset > rect2.position.y + rect2.size.height / 2 + offset) {
    if (cPoint1.angle === 180 && cPoint2.angle === 270) {
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 90) {
      add = goFromLeftToTop(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 0) {
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = findWayBetweenOppositeByX(rect1, offsetPoint1, offsetPoint2, false);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 180) {
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 90) {
      add = goAroundRect2ByX(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 180) {
      if (offsetPoint1.x <= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 0) {
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 270) {
      add = addPoint1YPoint2X(offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 0) {
      add = goAroundRect1ByXFrom270to0(rect1, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 180) {
      add = goAroundRect1ByXFrom270to180(rect1, offsetPoint1, offsetPoint2);
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 270) {
      add = goAroundRect1ByX(rect1, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 90) {
      add = goAroundTwoRectX(rect1, rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 90) {
      add = goFromRightToTop(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 270) {
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 0) {
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 180) {
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = findWayBetweenOppositeByX(rect1, offsetPoint1, offsetPoint2, false);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }
  }

  if (rect1.position.y + rect1.size.height / 2 + offset < rect2.position.y - rect2.size.height / 2 - offset) {
    if (cPoint1.angle === 180 && cPoint2.angle === 90) {
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 270) {
      add = goFromLeftToTop(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 0) {
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = findWayBetweenOppositeByX(rect1, offsetPoint1, offsetPoint2, true);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 180) {
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 90) {
      add = goAroundRect1ByX(rect1, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 0) {
      add = goAroundRect1ByXFrom270to0(rect1, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 180) {
      add = goAroundRect1ByXFrom270to180(rect1, offsetPoint1, offsetPoint2);
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 270) {
      add = goAroundTwoRectX(rect1, rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 0) {
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 90) {
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 270) {
      add = goFromRightToTop(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 180) {
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = findWayBetweenOppositeByX(rect1, offsetPoint1, offsetPoint2, true);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 180) {
      if (offsetPoint1.x <= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 270) {
      add = goAroundRect2ByX(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 90) {
      add = addPoint1YPoint2X(offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 0) {
      if (offsetPoint1.x >= offsetPoint2.x) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }
  }

  if (cPoint1.point.x > cPoint2.point.x) {
    if (cPoint1.angle === 270 && cPoint2.angle === 0) {
      if (offsetPoint1.y > offsetPoint2.y) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 180) {
      add = goAroundRect2ByYBottom(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 0) {
      if (rect1.position.y - rect1.size.height / 2 - offset < offsetPoint2.y) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 180) {
      add = goAroundRect2ByYTop(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 0) {
      add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 90) {
      if (offsetPoint1.y > offsetPoint2.y) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 270) {
      if (offsetPoint1.y > offsetPoint2.y) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 180) {
      add = goAroundRect2ByY(rect2, offsetPoint1, offsetPoint2);
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 0) {
      add = goAroundRect1ByY(rect1, offsetPoint1, offsetPoint2);
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 90) {
      add = goFromRightToTopY(rect1, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 270) {
      add = goFromRightToBottomY(rect1, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 180) {
      add = goAroundTwoRectY(rect1, rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 270) {
      add = findWayBetweenOppositeByY(rect1, offsetPoint1, offsetPoint2, false);
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 90) {
      add = findWayBetweenOppositeByY(rect1, offsetPoint1, offsetPoint2, false);
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }
  }

  if (cPoint1.angle === 90 && cPoint2.angle === 90) {
    if (rect1.position.y - rect1.size.height / 2 - offset < offsetPoint2.y) {
      add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
    } else {
      add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
    }
    return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
  }


  if (cPoint1.angle === 270 && cPoint2.angle === 270) {
    if (rect2.position.y + rect2.size.height / 2 + offset > offsetPoint1.y) {
      add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
    } else {
      add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
    }
    return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
  }

  if (cPoint1.point.x < cPoint2.point.x) {
    if (cPoint1.angle === 270 && cPoint2.angle === 0) {
      add = goAroundRect2ByYBottom(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 180) {
      if (offsetPoint1.y > offsetPoint2.y) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 0) {
      add = goAroundRect2ByYTop(rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 180) {
      if (rect1.position.y - rect1.size.height / 2 - offset < offsetPoint2.y) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 0) {
      add = goAroundTwoRectY(rect1, rect2, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 90) {
      add = goFromRightToTopY(rect1, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 270) {
      add = goFromRightToBottomY(rect1, offsetPoint1, offsetPoint2)
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 180 && cPoint2.angle === 180) {
      add = goAroundRect1ByY(rect1, offsetPoint1, offsetPoint2);
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 0) {
      add = goAroundRect2ByY(rect2, offsetPoint1, offsetPoint2);
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 90) {
      if (offsetPoint1.y > offsetPoint2.y) {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 270) {
      if (offsetPoint1.y > offsetPoint2.y) {
        add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      } else {
        add = addPoint1XPoint2Y(offsetPoint1, offsetPoint2);
      }
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 0 && cPoint2.angle === 180) {
      add = addPoint1YPoint2X(offsetPoint1, offsetPoint2);
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 90 && cPoint2.angle === 270) {
      add = findWayBetweenOppositeByY(rect1, offsetPoint1, offsetPoint2, true);
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }

    if (cPoint1.angle === 270 && cPoint2.angle === 90) {
      add = findWayBetweenOppositeByY(rect1, offsetPoint1, offsetPoint2, true);
      return [cPoint1.point, offsetPoint1, ...add, offsetPoint2, cPoint2.point];
    }
  }

  alert('Случай соединения не учтен')
  throw new Error('Случай соединения не учтен');
}
