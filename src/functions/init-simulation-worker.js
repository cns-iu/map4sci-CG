import { train } from './train.js';
import * as d3 from 'd3';
import { forcePre } from './force-pre.js';
import { forceStress } from './force-stress.js';
import { forceNodeEdgeRepulsion } from './force-node-edge-repulsion.js';
import { forcePost } from './force-post.js';
import { addNode } from './add-node.js';
import * as fs from 'fs';

export  function initSimulationWorker(simData, outFile) {
  let t0 = new Date().getTime();
  let dataObj = simData;
  let nodes = dataObj.nodes;
  let edges = dataObj.edges;
  let enabledNodes = dataObj.enabledNodes;
  let virtualEdges = dataObj.virtualEdges;
  let scales = {
    sx: d3.scaleLinear().domain(dataObj.xDomain).range(dataObj.xRange),
    sy: d3.scaleLinear().domain(dataObj.yDomain).range(dataObj.yRange),
  };

  let minEdgeWeight = null;
  let maxEdgeWeight = null;
  [minEdgeWeight, maxEdgeWeight] = d3.extent(edges, (e) => e.weight);
  console.log([minEdgeWeight, maxEdgeWeight]);
  let cx = d3.mean(nodes, (d) => d.x);
  let cy = d3.mean(nodes, (d) => d.y);

  // def force
  let simulation = d3
    .forceSimulation(nodes)
    .velocityDecay(0.4)
    .alphaDecay(1 - Math.pow(0.001, 1 / 500))
    .force('pre', forcePre(scales))
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
      forceNodeEdgeRepulsion(nodes, edges, enabledNodes, 0.1) //math-genealogy-linear
    )
    .stop();

  simulation.force('post', forcePost(nodes, edges));

  simulation.on('tick', function () {
    let runtime = new Date().getTime() - t0; //in ms
    console.log(`runtime: ${(runtime * 100) / 100000} sec`);
  });
  let freq = 2;
  while (enabledNodes.size < nodes.length) {
    addNode(
      nodes,
      edges,
      enabledNodes,
      virtualEdges,
      simulation,
      dataObj,
    );
    if (enabledNodes.size % freq == 0) {
      simulation
        .alpha(0.9)
        .velocityDecay(0.4)
        .alphaDecay(1 - Math.pow(0.001, 1 / 4))
        .restart();
      simulation.tick(4);
    }
  }
  train(10, simulation);

  simulation.on('end', function () {
    let coordinates = JSON.stringify({ nodes: nodes });
    fs.writeFileSync(outFile, coordinates);
  });
}
