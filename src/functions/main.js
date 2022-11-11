// import { initNodePosition } from './initNodePosition.js';
// import { updateForce } from './updateForce.js';
// import { initScales } from './initScales.js';
// import { initSimulationWorker } from './initSimulationWorker.js';
// import * as d3 from 'd3';

// const IS_PROGRESSIVE = true;
// export const window = {};
// export let nodes;
// export let progress = 0;

// export function main(data, outputFile) {
//   const DPR = 2;
//   let maxLevel = d3.max(data.nodes, (d) => d.level);
//   data.level2scale = {};
//   data.level2scale[maxLevel] = Math.sqrt(data.nodes.length) / 4; //default
//   window.data = data;
//   window.progress = IS_PROGRESSIVE ? 1 : data.nodes.length;
//   window.enabledNodes = new Set(data.node_id.slice(0, window.progress));
//   const nodes = data.nodes;
//   const edges = data.edges;

//   const width = 500;
//   const height = 500;
//   const scales = initScales(nodes, width, height);

//   const simData = {
//     nodes: nodes,
//     edges: edges,
//     virtualEdges: data.virtual_edges,
//     enabledNodes: window.enabledNodes,
//     id2index: data.id2index,
//     xDomain: scales.sx.domain(),
//     xRange: scales.sy.range(),
//     yDomain: scales.sy.domain(),
//     yRange: scales.sy.range(),
//     progress: window.progress,
//     dpr: DPR,
//     level2scale: data.level2scale,
//   };

//   initSimulationWorker(simData, outputFile);
// }

// export function addNode(
//   nodes,
//   edges,
//   enabledNodes,
//   virtualEdges,
//   simulation,
//   dataObj
// ) {
//   console.log(`${progress}/${nodes.length}`);
//   const start = progress;
//   progress += 1;
//   const root = nodes[0];
//   if (progress <= nodes.length) {
//     enabledNodes = initNodePosition(
//       nodes.slice(start, progress),
//       root,
//       enabledNodes,
//       nodes,
//       edges,
//       dataObj.id2index
//     );
//     //updateforce
//     updateForce(
//       nodes.slice(0, progress),
//       edges.filter((e) => e.source.update && e.target.update),
//       virtualEdges.filter((e) => e.source.update && e.target.update),
//       simulation,
//       dataObj
//     );
//   }
//   simulation.alpha(0.99);
//   return;
// }
