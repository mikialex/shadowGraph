export function createSVGConnectionLine(
  x1: number, y1: number,
  x2: number, y2: number) {
  const anchorStartX = (x1 + x2) * 0.5;
  return 'M ' + x1 + ' ' +
    y1 +
    ' C ' +
    anchorStartX + ' ' +
    y1 +
    ' , ' +
    anchorStartX + ' ' +
    y2 +
    ' , ' +
    x2 + ' ' +
    y2;
}