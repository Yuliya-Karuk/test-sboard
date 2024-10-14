import './style.css'
import { buildPath, ConnectionPoint, Rect } from "./utils2";
import { cases } from './examples.ts';
import { Renderer } from './renderer.ts';
import { createRandomRectAndPoints } from './randomUtils.ts';

let isShowRandom = false;
let intervalId: number | null = null;
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

const startRandom = () => {
  let currentCaseIndex = 0;

  function drawNextCase() {
    const [rect1, rect2, connectionPoint1, connectionPoint2] = cases[currentCaseIndex];

    revoke(rect1, rect2, connectionPoint1, connectionPoint2);

    currentCaseIndex = (currentCaseIndex + 1) % cases.length;
  }

  intervalId = window.setInterval(drawNextCase, 200);

  drawNextCase();
}

const stopRandom = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

const showMockedButton = document.querySelector('#mocked') as HTMLButtonElement;
const randomButton = document.querySelector('#random') as HTMLButtonElement;

showMockedButton.addEventListener('click', () => {
  if (!isShowRandom) {
    startRandom();
    isShowRandom = true;
    showMockedButton.textContent = 'Stop Mocked Data';
  } else {
    stopRandom();
    isShowRandom = false;
    renderer.clear();
    showMockedButton.textContent = 'Show Mocked Data';
  }
});

randomButton.addEventListener('click', () => {

  renderer.clear();
  const randomData = createRandomRectAndPoints();
  revoke(...randomData);
});



const rect1: Rect = { position: { x: 400, y: 400 }, size: { width: 100, height: 100 } };
// const connectionPoint1: ConnectionPoint = { point: { x: 400, y: 350 }, angle: 90 };
const connectionPoint1: ConnectionPoint = { point: { x: 450, y: 400 }, angle: 0 };
// const connectionPoint1: ConnectionPoint = { point: { x: 400, y: 450 }, angle: 270 };
// const connectionPoint1: ConnectionPoint = { point: { x: 350, y: 400 }, angle: 180 };
renderer.drawRect(rect1, 'blue'); // Отрисовка rect1
renderer.drawPoint(connectionPoint1.point); // Точка на rect1

// rect2
// const rect2: Rect = { position: { x: 200, y: 300 }, size: { width: 100, height: 200 } };
const rect2: Rect = { position: { x: 600, y: 300 }, size: { width: 100, height: 200 } };
// const connectionPoint2: ConnectionPoint = {"point":{"x":600,"y":200},"angle":90};
// const connectionPoint2: ConnectionPoint = {"point":{"x":650,"y": 300},"angle":0};
// const connectionPoint2: ConnectionPoint = {"point":{"x":600,"y":400},"angle":270};
const connectionPoint2: ConnectionPoint = {"point":{"x":550,"y":300},"angle":180};

renderer.drawPoint(connectionPoint2.point); // Точка на rect2
renderer.drawRect(rect2, 'green'); // Отрисовка rect2
const path1to2 = buildPath(rect1, connectionPoint1, rect2, connectionPoint2);
renderer.drawLine(path1to2, 'red');
