
import { Point, Rect } from "./types";

export class Renderer {
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
