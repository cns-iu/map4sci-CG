import { initScales } from './init-scales.js';
import { initSimulationWorker } from './init-simulation-worker.js';

export async function init(data, outputFile) {
  const DPR = 2;
  const IS_PROGRESSIVE = true;

  const window = {};
  window.progress = IS_PROGRESSIVE ? 1 : data.nodes.length;
  window.enabledNodes = new Set(data.node_id.slice(0, window.progress));
  // console.log(data.nodes)
  const nodes = data.nodes;
  const edges = data.edges;

  const width = 500;
  const height = 500;
  const scales = initScales(nodes, width, height);

  const simData = {
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

const output = await initSimulationWorker(simData, outputFile);
return output

}
