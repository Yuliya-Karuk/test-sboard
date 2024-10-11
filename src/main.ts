import './style.css'
import { buildPath, ConnectionPoint, Rect } from "./utils";
import { cases } from './examples.ts';
import { Renderer } from './renderer.ts';


const renderer = new Renderer();

function revoke(rect1: Rect, rect2: Rect, connectionPoint1: ConnectionPoint, connectionPoint2: ConnectionPoint) {
  renderer.clear();
  renderer.drawRect(rect1, 'blue');
  renderer.drawPoint(connectionPoint1.point);
  renderer.drawPoint(connectionPoint2.point);
  renderer.drawRect(rect2, 'green');
  const pathPoints = buildPath(rect1, connectionPoint1, rect2, connectionPoint2);
  renderer.drawLine(pathPoints, 'red');
}

let currentCaseIndex = 0;

console.log(cases.length);

function drawNextCase() {
  const [rect1, rect2, connectionPoint1, connectionPoint2] = cases[currentCaseIndex];

  revoke(rect1, rect2, connectionPoint1, connectionPoint2);

  currentCaseIndex = (currentCaseIndex + 1) % cases.length;
}

setInterval(drawNextCase, 2000);

drawNextCase();
