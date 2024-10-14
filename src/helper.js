function getRandomConnectionPoint(rect) {
  const { x, y } = rect.position;
  const { width, height } = rect.size;

  const p1 = { point: { x, y: y - height / 2 }, angle: 90 }
  const p2 = { point: { x: x + width / 2, y }, angle: 0 }
  const p3 = { point: { x, y: y + height / 2 }, angle: 270 }
  const p4 = { point: { x: x - width / 2, y }, angle: 180 }


  console.log(`const connectionPoint9: ConnectionPoint = ${JSON.stringify(p1)};`)
  console.log(`const connectionPoint9: ConnectionPoint = ${JSON.stringify(p2)};`)
  console.log(`const connectionPoint9: ConnectionPoint = ${JSON.stringify(p3)};`)
  console.log(`const connectionPoint9: ConnectionPoint = ${JSON.stringify(p4)};`)
}
