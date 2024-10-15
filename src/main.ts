import './style.css'
import { dataConverter } from "./dataConverter.ts";
import { cases } from './utils/examples.ts';
import { Renderer } from './renderer.ts';
import { createRandomRectAndPoints } from './utils/randomUtils.ts';
import { Rect, ConnectionPoint } from './utils/types.ts';

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
    showMockedButton.textContent = 'Удалить моковые прямоугольники';
  } else {
    stopRandom();
    isShowRandom = false;
    renderer.clear();
    showMockedButton.textContent = 'Показать моковые прямоугольники';
  }
});

randomButton.addEventListener('click', () => {
  renderer.clear();
  const randomData = createRandomRectAndPoints();
  draw(...randomData);
});
