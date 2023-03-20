import * as d3 from 'd3';
import { getCanvasScales } from './get-canvas-scales.js';

/**
 * Function to initialize scales
 * @param {Nodes} nodes 
 * @param {Width} w 
 * @param {Height} h 
 * @returns 
 */
export function initScales(nodes, w, h) {
  const DPR = 2;
  const FONT = 'Times';
  const xExtent = d3.extent(nodes, (d) => d.x);
  const yExtent = d3.extent(nodes, (d) => d.y);

  let scales = getCanvasScales(xExtent, yExtent, w, h);

  const extentLevel = d3.extent(nodes, (d) => d.level);
  scales.sr = d3.scaleLinear().domain(extentLevel).range([1, 1]);
  scales.ss = d3.scaleLinear().domain(extentLevel).range([4, 1]);
  scales.sl = d3.scaleLinear().domain(extentLevel).range([16, 16]); //label font size;
  scales.sc = d3.scaleLinear().domain(extentLevel).range(['black', 'black']); //node & label color

  const levels = Array.from(new Set(nodes.map((d) => d.level))).sort(
    (a, b) => a - b
  );
  const fonts = levels.map((l) => `${Math.round(scales.sl(l) * DPR)}px ${FONT}`);
  scales.sf = d3.scaleLinear().domain(levels).range(fonts); //font size
  return scales;
}
