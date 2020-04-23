export const gridCallback = (
  startX,
  startY,
  gridW,
  gridH,
  numX,
  numY
) => dothis => {
  const xSize = gridW / numX;
  const ySize = gridH / numY;
  for (let gy = startY; gy < startY + gridH; gy += ySize) {
    for (let gx = startX; gx < startX + gridW; gx += xSize) {
      dothis(gx, gy, xSize, ySize);
    }
  }
};

export const sqGridPaddingCallback = (
  startX,
  startY,
  gridW,
  numX,
  padding
) => dothis => {
  const xSize = (gridW - numX * padding) / numX;
  const ySize = (gridW - numX * padding) / numX;
  for (let gy = startY + padding; gy < startY + gridW; gy += ySize + padding) {
    for (
      let gx = startX + padding;
      gx < startX + gridW;
      gx += xSize + padding
    ) {
      dothis(gx, gy, xSize, ySize);
    }
  }
};
