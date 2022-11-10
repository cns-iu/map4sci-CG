import * as d3 from 'd3';

import { getCanvasScales } from './getCanvasScales.js';
export function initScales(nodes, w, h) {
  const DPR = 2;
  const FONT = 'Times';
  let xExtent = d3.extent(nodes, (d) => d.x);
  let yExtent = d3.extent(nodes, (d) => d.y);

  let scales = getCanvasScales(xExtent, yExtent, w, h);

  let extentLevel = d3.extent(nodes, (d) => d.level);
  scales.sr = d3.scaleLinear().domain(extentLevel).range([1, 1]);
  scales.ss = d3.scaleLinear().domain(extentLevel).range([4, 1]);
  scales.sl = d3.scaleLinear().domain(extentLevel).range([16, 16]); //label font size;
  scales.sc = d3.scaleLinear().domain(extentLevel).range(['black', 'black']); //node & label color

  let levels = Array.from(new Set(nodes.map((d) => d.level))).sort(
    (a, b) => a - b
  );
  let fonts = levels.map((l) => `${Math.round(scales.sl(l) * DPR)}px ${FONT}`);
  scales.sf = d3.scaleLinear().domain(levels).range(fonts); //font size
  return scales;
}
