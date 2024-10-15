import { Size, Rect, ConnectionPoint, Case } from "./types";

const PADDING = 20;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 780;

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSize(): Size {
  const width = getRandomInt(50, 300);
  const height = getRandomInt(50, 300);
  return { width, height };
}

function getRandomRect(size: Size): Rect {
  const x = getRandomInt(PADDING + size.width / 2, CANVAS_WIDTH - PADDING - size.width / 2);
  const y = getRandomInt(PADDING + size.height / 2, CANVAS_HEIGHT - PADDING - size.height / 2);

  return { position: { x, y }, size };
}

function getRandomConnectionPoint(rect: Rect): ConnectionPoint {
  const { x, y } = rect.position;
  const { width, height } = rect.size;

  const side = getRandomInt(1, 4);

  switch (side) {
    case 1:
      return { point: { x, y: y - height / 2 }, angle: 90 };
    case 2:
      return { point: { x: x + width / 2, y }, angle: 0 };
    case 3:
      return { point: { x, y: y + height / 2 }, angle: 270 };
    case 4:
      return { point: { x: x - width / 2, y }, angle: 180 };
    default:
      throw new Error(`Invalid side value: ${side}`);
  }
}

export function createRandomRectAndPoints(): Case {
  const size1 = getRandomSize();
  const size2 = getRandomSize();
  const rect1 = getRandomRect(size1);
  const rect2 = getRandomRect(size2);

  const connectionPoint1 = getRandomConnectionPoint(rect1);
  const connectionPoint2 = getRandomConnectionPoint(rect2);

  console.log([rect1, rect2, connectionPoint1, connectionPoint2])
  return [rect1, rect2, connectionPoint1, connectionPoint2];
}