import * as d3 from 'd3';
import * as fs from 'fs';
import { updateForce } from '../src/functions/updateForce.js';
import { initNodePosition } from '../src/functions/initNodePosition.js';
import { initScales } from '../src/functions/initScales.js';
import { initSimulationWorker } from '../src/functions/initSimulationWorker.js';
import { preprocess } from '../src/functions/preprocess.js';

const IS_PROGRESSIVE = true;
export const window = {};

if (process.argv.length !== 4) {
  console.error(`${process.argv[0]}: <input file> <output file>`);
  process.exit(-1);
}

const INPUT_FILE = JSON.parse(
  fs.readFileSync(process.argv[2], { encoding: 'utf8', flag: 'r' })
);
const OUTPUT_FILE = process.argv[3];

export let nodes;
export let progress = 0;

window.data = INPUT_FILE;
window.progress = IS_PROGRESSIVE ? 1 : INPUT_FILE.nodes.length;
window.enabledNodes = new Set(INPUT_FILE.node_id.slice(0, window.progress));
preprocess(INPUT_FILE, nodes);

let maxLevel = d3.max(INPUT_FILE.nodes, (d) => d.level);
INPUT_FILE.level2scale = {};
INPUT_FILE.level2scale[maxLevel] = Math.sqrt(INPUT_FILE.nodes.length) / 4; //default

function init(data, outputFile) {
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

  initSimulationWorker(simData, outputFile);
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

console.log(INPUT_FILE.level2scale);

init(INPUT_FILE, OUTPUT_FILE);
