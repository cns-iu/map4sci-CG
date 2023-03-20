import * as d3 from 'd3';

/**
 * FUnction to get canvas scales
 * @param {*} xExtent 
 * @param {*} yExtent 
 * @param {*} width 
 * @param {*} height 
 * @param {*} prescaling 
 * @returns 
 */

export function getCanvasScales(
  xExtent,
  yExtent,
  width,
  height,
  prescaling = 1.0
) {
  let margin = 50;
  let xSize = xExtent[1] - xExtent[0];
  let ySize = yExtent[1] - yExtent[0];

  //scale up
  let scale = 1 / prescaling;
  let xCenter = (xExtent[0] + xExtent[1]) / 2;
  let yCenter = (yExtent[0] + yExtent[1]) / 2;
  xExtent[0] = xCenter - (xSize / 2) * scale;
  xExtent[1] = xCenter + (xSize / 2) * scale;
  yExtent[0] = yCenter - (ySize / 2) * scale;
  yExtent[1] = yCenter + (ySize / 2) * scale;
  xSize = xExtent[1] - xExtent[0];
  ySize = yExtent[1] - yExtent[0];

  let xViewport = [margin, width - margin];
  let yViewport = [margin, height - margin];
  let drawWidth = xViewport[1] - xViewport[0];
  let drawHeight = yViewport[1] - yViewport[0];

  if (drawWidth / drawHeight > xSize / ySize) {
    let adjust = (ySize / drawHeight) * drawWidth - xSize;
    xExtent[0] -= adjust / 2;
    xExtent[1] += adjust / 2;
  } else {
    let adjust = (xSize / drawWidth) * drawHeight - ySize;
    yExtent[0] -= adjust / 2;
    yExtent[1] += adjust / 2;
  }

  let sx = d3.scaleLinear().domain(xExtent).range(xViewport);
  let sy = d3.scaleLinear().domain(yExtent).range(yViewport);
  return { sx, sy };
}
