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
const connectionPoint1: ConnectionPoint = { point: { x: 400, y: 350 }, angle: 90 };
// const connectionPoint1: ConnectionPoint = { point: { x: 450, y: 400 }, angle: 0 };
// const connectionPoint1: ConnectionPoint = { point: { x: 400, y: 450 }, angle: 270 };
// const connectionPoint1: ConnectionPoint = { point: { x: 350, y: 400 }, angle: 180 };
renderer.drawRect(rect1, 'blue'); // Отрисовка rect1
renderer.drawPoint(connectionPoint1.point); // Точка на rect1

// rect2
const rect2: Rect = { position: { x: 200, y: 500 }, size: { width: 100, height: 300 } };
// const connectionPoint2: ConnectionPoint = {"point":{"x":500,"y":560},"angle":90};
const connectionPoint2: ConnectionPoint = {"point":{"x":250,"y":500},"angle":0};
// const connectionPoint2: ConnectionPoint = {"point":{"x":250,"y":640},"angle":270};
// const connectionPoint2: ConnectionPoint = {"point":{"x":600,"y":600},"angle":180};

// const rect2: Rect = { position: { x: 100, y: 100 }, size: { width: 100, height: 100 } };
// const connectionPoint2: ConnectionPoint = { point: { x: 100, y: 50 }, angle: 90 };
// const connectionPoint2: ConnectionPoint = { point: { x: 150, y: 100 }, angle: 0 };
// const connectionPoint2: ConnectionPoint = { point: { x: 100, y: 150 }, angle: 270 };
// const connectionPoint2: ConnectionPoint = { point: { x: 50, y: 100 }, angle: 180 };

renderer.drawPoint(connectionPoint2.point); // Точка на rect2
renderer.drawRect(rect2, 'green'); // Отрисовка rect2
const path1to2 = buildPath(rect1, connectionPoint1, rect2, connectionPoint2);
renderer.drawLine(path1to2, 'red');


// rect3
// большой
const rect3: Rect = { position: { x: 400, y: 100 }, size: { width: 200, height: 80 } };
// const connectionPoint3: ConnectionPoint = {"point":{"x":400,"y":60},"angle":90};
// const connectionPoint3: ConnectionPoint = {"point":{"x":500,"y":100},"angle":0};
const connectionPoint3: ConnectionPoint = {"point":{"x":400,"y":140},"angle":270};
// const connectionPoint3: ConnectionPoint = {"point":{"x":300,"y":100},"angle":180};

// const rect3: Rect = { position: { x: 400, y: 100 }, size: { width: 100, height: 100 } };
// const connectionPoint3: ConnectionPoint = { point: { x: 400, y: 50 }, angle: 90 };
// const connectionPoint3: ConnectionPoint = { point: { x: 450, y: 100 }, angle: 0 };
// const connectionPoint3: ConnectionPoint = { point: { x: 400, y: 150 }, angle: 270 };
// const connectionPoint3: ConnectionPoint = { point: { x: 350, y: 100 }, angle: 180 };

// renderer.drawPoint(connectionPoint3.point); // Точка на rect3
// renderer.drawRect(rect3, 'green'); // Отрисовка rect3
// const path1to3 = buildPath(rect1, connectionPoint1, rect3, connectionPoint3);
// renderer.drawLine(path1to3, 'red');


// rect4
// const rect4: Rect = { position: { x: 450, y: 100 }, size: { width: 300, height: 80 } };
// const connectionPoint4: ConnectionPoint = { point: { x: 450, y: 60 }, angle: 90 };

// const rect4: Rect = { position: { x: 700, y: 100 }, size: { width: 100, height: 100 } };
// const connectionPoint4: ConnectionPoint = { point: { x: 700, y: 50 }, angle: 90 };
// const connectionPoint4: ConnectionPoint = { point: { x: 750, y: 100 }, angle: 0 };
// const connectionPoint4: ConnectionPoint = { point: { x: 700, y: 150 }, angle: 270 };
// const connectionPoint4: ConnectionPoint = { point: { x: 650, y: 100 }, angle: 180 };

// renderer.drawPoint(connectionPoint4.point); // Точка на rect4
// renderer.drawRect(rect4, 'green'); // Отрисовка rect4
// const path1to4 = buildPath(rect1, connectionPoint1, rect4, connectionPoint4);
// renderer.drawLine(path1to4, 'red');
// const path4to1 = buildPath(rect4, connectionPoint4, rect1, connectionPoint1);
// renderer.drawLine(path4to1, 'yellow');

// rect5
const rect5: Rect = { position: { x: 100, y: 400 }, size: { width: 100, height: 300 } };

// const rect5: Rect = { position: { x: 100, y: 400 }, size: { width: 100, height: 100 } };
// const connectionPoint5: ConnectionPoint = { point: { x: 100, y: 350 }, angle: 90 };
// const connectionPoint5: ConnectionPoint = { point: { x: 150, y: 400 }, angle: 0 };
// const connectionPoint5: ConnectionPoint = { point: { x: 100, y: 450 }, angle: 270 };
// const connectionPoint5: ConnectionPoint = { point: { x: 50, y: 400 }, angle: 180 };

// renderer.drawPoint(connectionPoint5.point); // Точка на rect5
// renderer.drawRect(rect5, 'green'); // Отрисовка rect5
// const path1to5 = buildPath(rect1, connectionPoint1, rect5, connectionPoint5);
// renderer.drawLine(path1to5, 'red');
// const path5to1 = buildPath(rect5, connectionPoint5, rect1, connectionPoint1);
// renderer.drawLine(path5to1, 'red');

// rect6
const rect6: Rect = { position: { x: 700, y: 400 }, size: { width: 100, height: 300 } };

// const rect6: Rect = { position: { x: 700, y: 400 }, size: { width: 100, height: 100 } };
// const connectionPoint6: ConnectionPoint = { point: { x: 700, y: 350 }, angle: 90 };
// const connectionPoint6: ConnectionPoint = { point: { x: 750, y: 400 }, angle: 0 };
// const connectionPoint6: ConnectionPoint = { point: { x: 700, y: 450 }, angle: 270 };
// const connectionPoint6: ConnectionPoint = { point: { x: 650, y: 400 }, angle: 180 };

// renderer.drawPoint(connectionPoint6.point); // Точка на rect6
// renderer.drawRect(rect6, 'green'); // Отрисовка rect6
// const path1to6 = buildPath(rect1, connectionPoint1, rect6, connectionPoint6);
// renderer.drawLine(path1to6, 'red');
// const path6to1 = buildPath(rect6, connectionPoint6, rect1, connectionPoint1);
// renderer.drawLine(path6to1, 'red');

// rect7
// const rect7: Rect = { position: { x: 320, y: 700 }, size: { width: 300, height: 80 } };
// const connectionPoint7: ConnectionPoint = {"point":{"x":320,"y":660},"angle":90};
// const connectionPoint7: ConnectionPoint = {"point":{"x":470,"y":700},"angle":0};
// const connectionPoint7: ConnectionPoint = {"point":{"x":320,"y":740},"angle":270};
// const connectionPoint7: ConnectionPoint = {"point":{"x":170,"y":700},"angle":180};

// const rect7: Rect = { position: { x: 100, y: 700 }, size: { width: 100, height: 100 } };
// const connectionPoint7: ConnectionPoint = { point: { x: 100, y: 650 }, angle: 90 };
// const connectionPoint7: ConnectionPoint = { point: { x: 150, y: 700 }, angle: 0 };
// const connectionPoint7: ConnectionPoint = { point: { x: 100, y: 750 }, angle: 270 };
// const connectionPoint7: ConnectionPoint = { point: { x: 50, y: 700 }, angle: 180 };

// renderer.drawPoint(connectionPoint7.point); // Точка на rect7
// renderer.drawRect(rect7, 'green'); // Отрисовка rect7
// const path1to7 = buildPath(rect1, connectionPoint1, rect7, connectionPoint7);
// renderer.drawLine(path1to7, 'red');


// rect8
// const rect8: Rect = { position: { x: 400, y: 700 }, size: { width: 200, height: 80 } };
// const connectionPoint8: ConnectionPoint = {"point":{"x":400,"y":660},"angle":90};
// const connectionPoint8: ConnectionPoint = {"point":{"x":500,"y":700},"angle":0};
// const connectionPoint8: ConnectionPoint = {"point":{"x":400,"y":740},"angle":270};
// const connectionPoint8: ConnectionPoint = {"point":{"x":300,"y":700},"angle":180};

// const rect8: Rect = { position: { x: 400, y: 700 }, size: { width: 100, height: 100 } };
// const connectionPoint8: ConnectionPoint = { point: { x: 400, y: 650 }, angle: 90 };
// const connectionPoint8: ConnectionPoint = { point: { x: 450, y: 700 }, angle: 0 };
// const connectionPoint8: ConnectionPoint = { point: { x: 400, y: 750 }, angle: 270 };
// const connectionPoint8: ConnectionPoint = { point: { x: 350, y: 700 }, angle: 180 };

// renderer.drawPoint(connectionPoint8.point); // Точка на rect8
// renderer.drawRect(rect8, 'green'); // Отрисовка rect8
// const path1to8 = buildPath(rect1, connectionPoint1, rect8, connectionPoint8);
// renderer.drawLine(path1to8, 'red');


// rect9
const rect9: Rect = { position: { x: 450, y: 700 }, size: { width: 300, height: 80 } };
const connectionPoint9: ConnectionPoint = {"point":{"x":470,"y":660},"angle":90};
// const connectionPoint9: ConnectionPoint = {"point":{"x":620,"y":700},"angle":0};
// const connectionPoint9: ConnectionPoint = {"point":{"x":470,"y":740},"angle":270};
// const connectionPoint9: ConnectionPoint = {"point":{"x":320,"y":700},"angle":180};


// const rect9: Rect = { position: { x: 700, y: 700 }, size: { width: 100, height: 100 } };
// const connectionPoint9: ConnectionPoint = { point: { x: 700, y: 650 }, angle: 90 };
// const connectionPoint9: ConnectionPoint = { point: { x: 750, y: 700 }, angle: 0 };
// const connectionPoint9: ConnectionPoint = { point: { x: 700, y: 750 }, angle: 270 };
// const connectionPoint9: ConnectionPoint = { point: { x: 650, y: 700 }, angle: 180 };

// renderer.drawPoint(connectionPoint9.point); // Точка на rect9
// renderer.drawRect(rect9, 'green'); // Отрисовка rect9
// const path1to9 = buildPath(rect1, connectionPoint1, rect9, connectionPoint9);
// renderer.drawLine(path1to9, 'red');
