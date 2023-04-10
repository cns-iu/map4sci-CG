import { train } from './train.js';
import * as d3 from 'd3';
import { forcePre } from './force-pre.js';
import { forceStress } from './force-stress.js';
import { forceNodeEdgeRepulsion } from './force-node-edge-repulsion.js';
import { forcePost } from './force-post.js';
import { addNode } from './add-node.js';

/**
 *
 * @param {SImulation Data} simData
 * @returns
 */

export async function initSimulationWorker(simData) {
  let t0 = new Date().getTime();
  let dataObj = simData;
  const nodes = dataObj.nodes;
  const edges = dataObj.edges;
  const enabledNodes = dataObj.enabledNodes;
  const virtualEdges = dataObj.virtualEdges;
  const scales = {
    sx: d3.scaleLinear().domain(dataObj.xDomain).range(dataObj.xRange),
    sy: d3.scaleLinear().domain(dataObj.yDomain).range(dataObj.yRange),
  };

  let minEdgeWeight = null;
  let maxEdgeWeight = null;
  [minEdgeWeight, maxEdgeWeight] = d3.extent(edges, (e) => e.weight);
  console.log([minEdgeWeight, maxEdgeWeight]);
  const cx = d3.mean(nodes, (d) => d.x);
  const cy = d3.mean(nodes, (d) => d.y);

  // def force
  const simulation = d3
    .forceSimulation(nodes)
    .velocityDecay(0.4)
    .alphaDecay(1 - Math.pow(0.001, 1 / 500))
    .force('pre', forcePre())
    .force(
      'link',
      d3
        .forceLink(edges)
        .distance((e) => e.weight / minEdgeWeight)
        .strength((e) => (e.source.update && e.target.update ? 0.2 : 0))
    )
    .force(
      'stress',
      forceStress(nodes, virtualEdges, nodes.length * 6)
        .distance((e) => Math.pow(e.weight / minEdgeWeight, 0.95 + 1 / e.hops))
        .strength((e) => 0.03 / Math.pow(e.weight / minEdgeWeight, 2))
    )
    .force(
      'stress-edge',
      // topics-refined-linear
      forceStress(nodes, edges, nodes.length, false)
        .distance((e) => e.weight / minEdgeWeight)
        .strength((e) => 0)
    )
    .force(
      'central',
      d3.forceRadial(cx, cy, 0).strength(0.0001) //math-genealogy-linear
    )
    .force(
      'charge',
      d3.forceManyBody().strength((d) => (d.update ? -0.1 : 0)) //math-genealogy-linear
    )
    .force(
      'node-edge-repulsion',
      forceNodeEdgeRepulsion(nodes, edges, 0.1) //math-genealogy-linear
    )
    .stop();

  simulation.force('post', forcePost(nodes, edges));

  simulation.on('tick', function () {
    let runtime = new Date().getTime() - t0; //in ms
    console.log(`runtime: ${(runtime * 100) / 100000} sec`);
  });
  const freq = 2;
  while (window.enabledNodes.size < nodes.length) {
    addNode(
      nodes,
      edges,
      window.enabledNodes,
      virtualEdges,
      simulation,
      dataObj
    );
    if (window.enabledNodes.size % freq == 0) {
      simulation
        .alpha(0.9)
        .velocityDecay(0.4)
        .alphaDecay(1 - Math.pow(0.001, 1 / 4))
        .restart();
      simulation.tick(4);
    }
  }
  train(10, simulation);

  async function promiseData() {
    return new Promise((resolve) => {
      simulation.on('end', () => {
        resolve(nodes);
      });
    });
  }
  const data = await promiseData();
  return data;
}
