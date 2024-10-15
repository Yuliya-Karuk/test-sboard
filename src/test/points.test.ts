import { describe, test, expect } from 'vitest';
import { ConnectionPoint, Rect } from '../utils/types';
import { checkConnectionPoint } from '../utils/checkers';

const rect1: Rect = {
  position: { x: 400, y: 100 },
  size: { width: 100, height: 50 },
};

describe('checkConnectionPoint for rect1', () => {
  test('correctly identifies valid top connection for rect1', () => {
    const cPoint: ConnectionPoint = {
      point: { x: 400, y: 75 },
      angle: 90,
    };
    expect(checkConnectionPoint(rect1, cPoint)).toBe(true);
  });

  test('correctly identifies valid bottom connection for rect1', () => {
    const cPoint: ConnectionPoint = {
      point: { x: 400, y: 125 },
      angle: 270,
    };
    expect(checkConnectionPoint(rect1, cPoint)).toBe(true);
  });

  test('correctly identifies valid right connection for rect1', () => {
    const cPoint: ConnectionPoint = {
      point: { x: 450, y: 100 },
      angle: 0,
    };
    expect(checkConnectionPoint(rect1, cPoint)).toBe(true);
  });

  test('correctly identifies valid left connection for rect1', () => {
    const cPoint: ConnectionPoint = {
      point: { x: 350, y: 100 },
      angle: 180,
    };
    expect(checkConnectionPoint(rect1, cPoint)).toBe(true);
  });

  test('incorrectly identifies inward top connection for rect1', () => {
    const cPoint: ConnectionPoint = {
      point: { x: 400, y: 75 },
      angle: 270,
    };
    expect(checkConnectionPoint(rect1, cPoint)).toBe(false);
  });

  test('incorrectly identifies inward bottom connection for rect1', () => {
    const cPoint: ConnectionPoint = {
      point: { x: 400, y: 125 },
      angle: 90,
    };
    expect(checkConnectionPoint(rect1, cPoint)).toBe(false);
  });

  test('incorrectly identifies inward right connection for rect1', () => {
    const cPoint: ConnectionPoint = {
      point: { x: 450, y: 100 },
      angle: 180,
    };
    expect(checkConnectionPoint(rect1, cPoint)).toBe(false);
  });

  test('incorrectly identifies inward left connection for rect1', () => {
    const cPoint: ConnectionPoint = {
      point: { x: 350, y: 100 },
      angle: 0,
    };
    expect(checkConnectionPoint(rect1, cPoint)).toBe(false);
  });


  test('throws error for invalid angle for rect1', () => {
    const cPoint: ConnectionPoint = {
      point: { x: 400, y: 75 },
      angle: 45,
    };
    expect(checkConnectionPoint(rect1, cPoint)).toBe(false);
  });

  test('throws error for point not on edge for rect1', () => {
    const cPoint: ConnectionPoint = {
      point: { x: 390, y: 90 },
      angle: 90,
    };
    expect(checkConnectionPoint(rect1, cPoint)).toBe(false);
  });
});