import my_data from './out.json' assert { type: 'json' };
import * as d3 from 'd3';
import { updateForce } from './functions/updateForce.js';
import { initNodePosition } from './functions/initNodePosition.js';
import { initScales } from './functions/initScales.js';
import { initSimulationWorker } from './functions/initSimulationWorker.js';
import { preprocess } from './functions/preprocess.js';

const IS_PROGRESSIVE = true;
export const window = {};

const fns = ['out.js'];
export let nodes;
export let progress = 0;

window.data = my_data;
window.progress = IS_PROGRESSIVE ? 1 : my_data.nodes.length;
window.enabledNodes = new Set(my_data.node_id.slice(0, window.progress));
preprocess(my_data, nodes);

let maxLevel = d3.max(my_data.nodes, (d) => d.level);
my_data.level2scale = {};
my_data.level2scale[maxLevel] = Math.sqrt(my_data.nodes.length) / 4; //default

if (fns[0].includes('topics')) {
  my_data.level2scale = {};
  my_data.level2scale[maxLevel] = 20;
} else if (fns[0].includes('topics_steiner')) {
  my_data.level2scale = {};
  my_data.level2scale[maxLevel - 1] = 20;
  my_data.level2scale[maxLevel] = 200;
} else if (fns[0].includes('lastfm')) {
  let baseScale = 1;
  let scaleFactor = Math.pow(15, 1 / (maxLevel - 1));
  my_data.level2scale = {};
  for (let i = 1; i <= maxLevel; i++) {
    if (i == maxLevel) {
      my_data.level2scale[i] = baseScale * Math.pow(scaleFactor, i - 1);
    }
  }
}

function init(data) {
  const DPR = 2;

  let nodes = data.nodes;
  let edges = data.edges;

  let width = 500;
  let height = 500;
  let scales = initScales(nodes, width, height);

  let simData = {
    nodes: nodes,
    edges: edges,
    virtualEdges: data.virtual_edges,
    enabledNodes: window.enabledNodes,
    id2index: data.id2index,
    xDomain: scales.sx.domain(),
    xRange: scales.sy.range(),
    yDomain: scales.sy.domain(),
    yRange: scales.sy.range(),
    progress: window.progress,
    dpr: DPR,
    level2scale: data.level2scale,
  };

  initSimulationWorker(simData);
}

export function addNode(
  nodes,
  edges,
  enabledNodes,
  virtualEdges,
  simulation,
  dataObj
) {
  console.log(`${progress}/${nodes.length}`);
  let start = progress;
  progress += 1;
  let root = nodes[0];
  if (progress <= nodes.length) {
    enabledNodes = initNodePosition(
      nodes.slice(start, progress),
      root,
      enabledNodes,
      nodes,
      edges,
      dataObj.id2index
    );
    //updateforce
    updateForce(
      nodes.slice(0, progress),
      edges.filter((e) => e.source.update && e.target.update),
      virtualEdges.filter((e) => e.source.update && e.target.update),
      simulation,
      dataObj
    );
  }
  simulation.alpha(0.99);
  return;
}

console.log(my_data.level2scale);

init(my_data);
