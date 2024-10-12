import { Case } from "./examples";
import { ConnectionPoint, Rect } from "./utils";

// function getRandomInt(min: number, max: number): number {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function getRandomRect(): Rect {
//   const padding = 20;
//   const canvasWidth = 800;
//   const canvasHeight = 780;

//   const width = getRandomInt(50, 300);
//   const height = getRandomInt(50, 300);

//   const x = getRandomInt(padding + width / 2, canvasWidth - padding - width / 2);
//   const y = getRandomInt(padding + height / 2, canvasHeight - padding - height / 2);

//   return { position: { x, y }, size: { width, height } };
// }

// function getRandomConnectionPoint(rect: Rect): ConnectionPoint {
//   const { x, y } = rect.position;
//   const { width, height } = rect.size;


//   const side = getRandomInt(1, 4);

//   switch (side) {
//     case 1:
//       return { point: { x: x, y: y - height / 2 }, angle: 90 };
//     case 2:
//       return { point: { x: x + width / 2, y: y }, angle: 0 };
//     case 3:
//       return { point: { x: x, y: y + height / 2 }, angle: 270 };
//     case 4:
//       return { point: { x: x - width / 2, y: y }, angle: 180 };
//     default:
//       throw new Error('jj');
//   }
// }

// export function createRandomRectAndPoints() {
//   const rect1 = getRandomRect();
//   const rect2 = getRandomRect();

//   const connectionPoint1 = getRandomConnectionPoint(rect1);
//   const connectionPoint2 = getRandomConnectionPoint(rect2);

//   const randomData: Case = [rect1, rect2, connectionPoint1, connectionPoint2];

//   return randomData;
// }

const PADDING = 20;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 780;

interface Size {
  width: number;
  height: number;
}

// Function to generate a random integer
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random rectangle with the same size for both rectangles
function getRandomSize(): Size {
  const width = getRandomInt(50, 300);  // Random width
  const height = getRandomInt(50, 300); // Random height
  return { width, height };
}

function getRandomRect(size: Size): Rect {
  const x = getRandomInt(PADDING + size.width / 2, CANVAS_WIDTH - PADDING - size.width / 2);
  const y = getRandomInt(PADDING + size.height / 2, CANVAS_HEIGHT - PADDING - size.height / 2);

  return { position: { x, y }, size };
}

// Function to get a random connection point on a rectangle
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

// Function to create two identical-size rectangles and their connection points
export function createRandomRectAndPoints(): Case {
  const size = getRandomSize(); // Generate a random size once
  const rect1 = getRandomRect(size); // Create the first rectangle with that size
  const rect2 = getRandomRect(size); // Create the second rectangle with the same size

  const connectionPoint1 = getRandomConnectionPoint(rect1);
  const connectionPoint2 = getRandomConnectionPoint(rect2);

  return [rect1, rect2, connectionPoint1, connectionPoint2];
}