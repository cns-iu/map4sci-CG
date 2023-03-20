import { parse } from 'path';
import * as fs from 'fs';
import path, { join } from 'path';
// const { readdirSync } = require('fs');
import cytoscape from 'cytoscape';
import { edges2graph } from './edges2graph.js';
import { radialLayout } from './radial-layout.js';


if (process.argv.length <= 2) {
  console.error(`${process.argv[0]}: <input file> <output file>`);
  process.exit(-1);
}

function main(inputDir, outputFIle) {
  const dirIn = inputDir;

  const fns = fs
    .readdirSync(dirIn)
    .filter((fn) => fn.endsWith('.txt'))
    .sort()
    .map((fn) => path.join(dirIn, fn));

  const levels = Array.from({ length: fns.length }, (_, i) => i + 1);

  const maxLevel = levels.length;

  //Linear Increment
  const baseWeight = 200;
  const increment = 50;

  let weights = levels.map((l) => baseWeight + (maxLevel - l) * increment);
  weights = weights.map((w) => w / 200);

  //---------------------------------------------------------------------------------------------------

  let i2k, label2i;
  let g;
  let subgraph;
  for (let i = fns.length - 1; i >= 0; i--) {
    const fn = fns[i];
    const level = levels[i];
    const weight = weights[i];

    const fileContent = fs.readFileSync(fn, 'utf-8');

    if (level === maxLevel) {
      const result = edges2graph(fileContent.split('\n'));
      g = result.graph;
      i2k = result.i2k;
      label2i = result.label2i;
      subgraph = result;
    } else {
      subgraph = edges2graph(fileContent.split('\n'), i2k, label2i);
      const nodeCount = Object.keys(subgraph.graph.nodes()).length;
    }
    Object.keys(subgraph.graph.nodes()).forEach((node) => {
      g.$id(node).data('weight', weight);
    });

    subgraph.graph.edges().forEach((edge) => {
      g.$id(edge.id()).data('weight', weight);
    });
  }

  const n = g.nodes().length;
  const d = {};


  console.log('all_pairs_shortest_path...');
  // compute all-pairs shortest path lengths using Dijkstra's algorithm
  g.nodes().forEach((n1) => {
    const distances = g.elements().dijkstra(n1, (edge) => edge.data('weight'));
    const dn = {};
    g.nodes().forEach((n2) => {
      const distance = distances.distanceTo(n2);
      dn[n2.id()] = distance;
    });
    d[n1.id()] = dn;
  });
 

  // -------------------------------------------------------------------------------------------------------------------------------------------------------------------

  console.log('k-hop all_pairs_shortest_path...');
  const hops = new Array(n).fill(0);

  g.nodes().forEach((n1) => {
    const numHops = g.elements().dijkstra(n1, function (edge) {
      return 1;
    });
    const hopsn = new Array(n).fill(0);
    g.nodes().forEach((n2) => {
      const distance = numHops.distanceTo('#' + n2.id());
      hopsn[n2.id()] = distance;
    });
    hops[n1.id()] = hopsn;
  });

  //------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  const layout = 'radial';

  if (layout === 'radial') {
    const maxNodeWeights = Object.entries(d).map(([n1, distances]) => [
      n1,
      Math.max(...Object.values(distances)),
    ]);
    const minMaximum = Math.min(...maxNodeWeights.map(([_, w]) => w));
    const minMaxNodeIds = maxNodeWeights
      .filter(([_n1, weight]) => weight === minMaximum)
      .map(([n1, _weight]) => +n1);
    const minNodeId = '' + Math.min(...minMaxNodeIds);

    const root = minNodeId;

    const pos0 = radialLayout(g, root);
  }
}
main(process.argv[2], process.argv[3]);
