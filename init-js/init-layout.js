import { parse } from 'path';
import * as fs from 'fs';
import path, { join } from 'path';
// const { readdirSync } = require('fs');
import cytoscape from 'cytoscape';

function edges2graph(lines, i2k = null, label2i = null) {
  const pattern = /"(.+)" -- "(.+)"/;
  const nodes = new Set();
  const edges = new Set();

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.length > 0) {
      const [_, source, target] = line.match(pattern);
      nodes.add(source);
      nodes.add(target);
      edges.add([source, target]);
    }
  }
  if (label2i === null) {
    const nodesArray = Array.from(nodes);
    label2i = nodesArray.reduce((map, node, i) => {
      map[node] = i;
      return map;
    }, {});
    i2k = nodesArray.map((node, i) => i);
  }

  const nodesArray = Array.from(nodes);

  const nodesWithIds = nodesArray.map((node, i) => ({
    id: label2i[node],
    label: node,
  }));
  const ids = nodesWithIds.map((node) => node.id);

  const g = cytoscape({
    /* options */
  });

  nodesArray.forEach((node) => {
    g.add({
      group: 'nodes',
      data: {
        id: node.toString(),
      },
    });
  });

  const edgesArray = Array.from(edges);

  const edgesWithIds = edgesArray.map(([source, target]) => [
    i2k[label2i[source]],
    i2k[label2i[target]],
  ]);

  edgesArray.forEach((edge) => {
    g.add({
      group: 'edges',
      data: {
        id: `${edge[0].toString()}-${edge[1].toString()}`,
        source: edge[0].toString(),
        target: edge[1].toString(),
      },
    });
  });
  return { graph: g, i2k, label2i };
}

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

  //   console.log(fns)
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
      //   console.log(Object.keys(subgraph.graph.nodes()))
      const nodeCount = Object.keys(subgraph.graph.nodes()).length;
      console.log(nodeCount);
      console.log(fn, level, nodeCount, weight);
      // g = subgraph.graph;
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

  console.log(g.nodes().length);
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
  console.log(g.edges().length);

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
    console.log(minMaximum, minNodeId, minMaxNodeIds.join('|'));
    console.log(g.$id(minNodeId).json());
  }
}
main(process.argv[2], process.argv[3]);

