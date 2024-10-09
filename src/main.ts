import './style.css'
import { buildPath, ConnectionPoint, Point, Rect } from "./js/utils";


class Renderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.querySelector('canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d')!;
  }

  drawRect(rect: Rect, color: string = 'blue') {
    const { position, size } = rect;
    this.context.fillStyle = color;

    this.context.fillRect(
      position.x - size.width / 2,
      position.y - size.height / 2,
      size.width,
      size.height
    );
  }

  drawPoint(point: Point, color: string = 'black', diameter: number = 5) {
    const radius = diameter / 2;
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(point.x, point.y, radius, 0, Math.PI * 2);
    this.context.fill();
}

  drawLine(points: Point[], color: string = 'red') {
    if (points.length < 2) return;

    this.context.strokeStyle = color;
    this.context.lineWidth = 2;
    this.context.beginPath();

    this.context.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.context.lineTo(points[i].x, points[i].y);
    }

    this.context.stroke();
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// Пример использования Renderer для отрисовки двух прямоугольников и линии
const renderer = new Renderer();

const rect1: Rect = {
  position: { x: 100, y: 100 },
  size: { width: 100, height: 50 }
};

const rect2: Rect = {
  position: { x: 300, y: 300 },
  size: { width: 150, height: 100 }
};

// const cPoint1: ConnectionPoint = {
//   point: { x: 100, y: 75 },
//   angle: 90 // направлен вверх
// };

// const cPoint1: ConnectionPoint = {
//   point: { x: 100, y: 125 },
//   angle: 270 // направлен вниз
// };

// const cPoint1: ConnectionPoint = {
//   point: { x: 150, y: 100 },
//   angle: 0 // направлен вправо
// };

const cPoint1: ConnectionPoint = {
  point: { x: 50, y: 100 },
  angle: 180 // направлен влево
};

// const cPoint2: ConnectionPoint = {
//   point: { x: 300, y: 250 },
//   angle: 90 // направлен вверх
// };

// const cPoint2: ConnectionPoint = {
//   point: { x: 300, y: 350 },
//   angle: 270 // направлен вниз
// };

// const cPoint2: ConnectionPoint = {
//   point: { x: 375, y: 300 },
//   angle: 0 // направлен вправо
// };

const cPoint2: ConnectionPoint = {
  point: { x: 225, y: 300 },
  angle: 180 // направлен влево
};

const offset = 10; // расстояние обхода
const pathPoints = buildPath(rect1, cPoint1, rect2, cPoint2);


renderer.clear();
renderer.drawRect(rect1, 'blue');
renderer.drawPoint(cPoint1.point);
renderer.drawPoint(cPoint2.point);
renderer.drawRect(rect2, 'green');
renderer.drawLine(pathPoints, 'red');

// console.log(checkConnectionPoint(rect1, cPoint1));
// console.log(checkConnectionPoint(rect2, cPoint2));