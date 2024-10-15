import './style.css'
import { dataConverter } from "./utils.ts";
import { cases } from './examples.ts';
import { Renderer } from './renderer.ts';
import { createRandomRectAndPoints } from './randomUtils.ts';
import { Rect, ConnectionPoint } from './types.ts';

let isShowRandom = false;
let intervalId: number | null = null;
const renderer = new Renderer();

const showMockedButton = document.querySelector('#mocked') as HTMLButtonElement;
const randomButton = document.querySelector('#random') as HTMLButtonElement;
const enterButton = document.querySelector('#enter') as HTMLButtonElement;

const closeButton = document.querySelector('.modal-close-btn') as HTMLButtonElement;
const modalForm = document.querySelector('.modal-form') as HTMLFormElement;
const modal = document.querySelector(".modal");

function draw(rect1: Rect, rect2: Rect, connectionPoint1: ConnectionPoint, connectionPoint2: ConnectionPoint) {
  renderer.clear();
  renderer.drawRect(rect1, 'blue');
  renderer.drawPoint(connectionPoint1.point);
  renderer.drawPoint(connectionPoint2.point);
  renderer.drawRect(rect2, 'green');
  const pathPoints = dataConverter(rect1, connectionPoint1, rect2, connectionPoint2);
  renderer.drawLine(pathPoints, 'red');
}

const startRandom = () => {
  let currentCaseIndex = 0;

  function drawNextCase() {
    const [rect1, rect2, connectionPoint1, connectionPoint2] = cases[currentCaseIndex];
    draw(rect1, rect2, connectionPoint1, connectionPoint2);

    currentCaseIndex = (currentCaseIndex + 1) % cases.length;
  }

  intervalId = window.setInterval(drawNextCase, 2000);
  drawNextCase();
}

const stopRandom = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

const drawRectByEnteredData = (e: Event) => {
  e.preventDefault();
  modal?.classList.toggle('modal-active');

  const rect1PositionX = document.querySelector("#positionX-rect1") as HTMLInputElement;
  const rect1PositionY = document.querySelector("#positionY-rect1") as HTMLInputElement;
  const rect1Width = document.querySelector("#width-rect1") as HTMLInputElement;
  const rect1Height = document.querySelector("#height-rect1") as HTMLInputElement;

  const point1PositionX = document.querySelector("#x-point1") as HTMLInputElement;
  const point1PositionY = document.querySelector("#y-point1") as HTMLInputElement;
  const point1Angle = document.querySelector("#angle-point1") as HTMLInputElement;

  const rect2PositionX = document.querySelector("#positionX-rect2") as HTMLInputElement;
  const rect2PositionY = document.querySelector("#positionY-rect2") as HTMLInputElement;
  const rect2Width = document.querySelector("#width-rect2") as HTMLInputElement;
  const rect2Height = document.querySelector("#height-rect2") as HTMLInputElement;

  const point2PositionX = document.querySelector("#x-point2") as HTMLInputElement;
  const point2PositionY = document.querySelector("#y-point2") as HTMLInputElement;
  const point2Angle = document.querySelector("#angle-point2") as HTMLInputElement;

  const rect1: Rect = {
    position: {
      x: +rect1PositionX.value,
      y: +rect1PositionY.value,
    },
    size: {
      width: +rect1Width.value,
      height: +rect1Height.value,
    }
  }

  const rect2: Rect = {
    position: {
      x: +rect2PositionX.value,
      y: +rect2PositionY.value,
    },
    size: {
      width: +rect2Width.value,
      height: +rect2Height.value,
    }
  }

  const cPoint1: ConnectionPoint = {
    point: {
      x: +point1PositionX.value,
      y: +point1PositionY.value,
    },
    angle: +point1Angle.value,
  }

  const cPoint2: ConnectionPoint = {
    point: {
      x: +point2PositionX.value,
      y: +point2PositionY.value,
    },
    angle: +point2Angle.value,
  }

  draw(rect1, rect2, cPoint1, cPoint2);
}


enterButton.addEventListener("click", () => modal?.classList.toggle('modal-active'));
closeButton.addEventListener("click", () => modal?.classList.toggle('modal-active'));
modalForm.addEventListener("submit", (e: Event) => drawRectByEnteredData(e))


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
  draw(...randomData);
});


const rect1: Rect = { position: { x: 317.5, y: 184.5 }, size: { width: 259, height: 63 } };
const connectionPoint1: ConnectionPoint = { point: { x: 317.5, y: 153 }, angle: 90 };
// const connectionPoint1: ConnectionPoint = { point: { x: 450, y: 400 }, angle: 0 };
// const connectionPoint1: ConnectionPoint = { point: { x: 400, y: 450 }, angle: 270 };
// const connectionPoint1: ConnectionPoint = { point: { x: 350, y: 400 }, angle: 180 };
renderer.drawRect(rect1, 'blue'); // Отрисовка rect1
renderer.drawPoint(connectionPoint1.point); // Точка на rect1

// rect2
const rect2: Rect = { position: { x: 193.5, y: 295.5 }, size: { width: 259, height: 89 } };
const connectionPoint2: ConnectionPoint = {"point":{"x":193.5,"y":251},"angle":90};
// const connectionPoint2: ConnectionPoint = {"point":{"x":250,"y":500},"angle":0};
// const connectionPoint2: ConnectionPoint = {"point":{"x":250,"y":640},"angle":270};
// const connectionPoint2: ConnectionPoint = {"point":{"x":600,"y":600},"angle":180};

// const rect2: Rect = { position: { x: 100, y: 100 }, size: { width: 100, height: 100 } };
// const connectionPoint2: ConnectionPoint = { point: { x: 100, y: 50 }, angle: 90 };
// const connectionPoint2: ConnectionPoint = { point: { x: 150, y: 100 }, angle: 0 };
// const connectionPoint2: ConnectionPoint = { point: { x: 100, y: 150 }, angle: 270 };
// const connectionPoint2: ConnectionPoint = { point: { x: 50, y: 100 }, angle: 180 };

renderer.drawPoint(connectionPoint2.point); // Точка на rect2
renderer.drawRect(rect2, 'green'); // Отрисовка rect2
const path1to2 = dataConverter(rect1, connectionPoint1, rect2, connectionPoint2);
renderer.drawLine(path1to2, 'red');