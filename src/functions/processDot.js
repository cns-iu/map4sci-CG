import * as fs from 'fs';
import * as graphology from 'graphology';
import cytoscape from 'cytoscape';
import { dijkstra, unweighted } from 'graphology-shortest-path';

export function processDot(data) {
  let node_id = [];
  let edge_source = [];
  let node_weight = [];
  let node_label = [];
  let node_neighbors = [];
  let node_x = [];
  let node_y = [];
  let edge_target = [];
  let edge_weight = [];

  const node_perplexity_Object = {};
  data[0].children
    .filter((e) => e.type === 'edge_stmt')
    .map((edge) => {
      let parent = edge.edge_list[0].id;
      node_perplexity_Object[parent];
      if (node_perplexity_Object.hasOwnProperty(parent)) {
        node_perplexity_Object[parent] += 1;
      } else {
        node_perplexity_Object[parent] = 1;
      }
    });

  const node_perplexity = Object.values(node_perplexity_Object);

  data[0].children
    .filter((e) => e.type === 'node_stmt')
    .map((node) => {
      // console.log(node)
      node.attr_list.forEach((item) => {
        if (item.id === 'label') {
          node_label.push(item.eq);
        } else if (item.id === 'weight') {
          node_weight.push(parseFloat(item.eq));
        }
      });
      node_id.push(node.node_id.id);
    });

  data[0].children
    .filter((e) => e.type === 'edge_stmt')
    .map((edge) => {
      let tempArray = [];
      let source = edge.edge_list[0].id;
      let target = edge.edge_list[1].id;
      let edgeWeight = edge.attr_list[0].eq;
      tempArray.push(source);
      tempArray.push(target);
      node_neighbors.push(tempArray);

      edge_source.push(source);
      edge_target.push(target);
      edge_weight.push(parseFloat(edgeWeight));
    });

  node_id.forEach(() => {
    node_x.push(Math.random() * (10000 + 10000) - 10000);
    node_y.push(Math.random() * (10000 + 10000) - 10000);
  });

  //creating node_parent
  const node_parent = [];
  node_neighbors.forEach((pairs, i) => {
    if (i == 0) {
      node_parent.push(null);
    } else {
      node_parent.push(pairs[0]);
    }
  });

  //creating node index
  const node_index = [];
  node_id.forEach((node, i) => {
    node_index.push(i);
  });

  // const graph = new graphology.default.DirectedGraph();

  var cy = cytoscape({
    /* options */
  });

  //adding nodes
  node_id.forEach((node, i) => {
    // graph.addNode(node, { index: i });
    cy.add({
      group: 'nodes',
      data: { weight: node_weight[i], id: node.toString() },
      position: { x: node_x[i], y: node_y[i] },
    });
  });

  //adding edges
  const weights = {};
  edge_weight.forEach((edgeWeight, i) => {
    weights[i] = parseFloat(edgeWeight);
  });

  node_neighbors.forEach((edge, i) => {
    // graph.addEdge(edge[0], edge[1], { weight: weights[i] });
    cy.add({
      group: 'edges',
      data: {
        id: `${edge[0]}-${edge[1]}`.toString(),
        source: edge[0],
        target: edge[1],
        weight: edge_weight[i],
      },
    });
  });

  const virtualEdges = [];

  //graphology version
  // node_id.forEach((source) => {
  //   const weightedPaths = dijkstra.singleSource(graph, source, 'weight');
  //   const hops = unweighted.singleSourceLength(graph, source);

  //   Object.entries(weightedPaths).forEach(([target, path]) => {
  //     let totalWeight = 0;
  //     const totalHops = hops[target] || 0;
  //     for (let j = 1; j < path.length; j++) {
  //       const weight = graph.getEdgeAttribute(path[j - 1], path[j], 'weight');
  //       totalWeight += weight;
  //     }

  //     if (totalWeight > 0 && totalHops > 0) {
  //       virtualEdges.push({
  //         source,
  //         target: +target,
  //         weight: totalWeight,
  //         hops: totalHops,
  //       });
  //     }
  //   });
  // });

  //cytoscape version
  const cytoscapeEdges = [];
  for (const source of node_id) {
    const weightedPaths = cy
      .elements()
      .dijkstra(cy.$id(source.toString()), function (edge) {
        return edge.data('weight');
      });

    const hopsFunction = cy
      .elements()
      .dijkstra(cy.$id(source.toString()), function (edge) {
        return 1;
      });

    for (const target of node_id) {
      let weight = weightedPaths.distanceTo(cy.$id(target.toString()));
      let hops = hopsFunction.distanceTo(cy.$id(target.toString()))

      if (source !== target) {
        // do stuff

        cytoscapeEdges.push({
          source,
          target: target,
          weight: weight,
          hops: hops,
        });
      }
    }
  }

  const virtual_edge_source = [];
  const virtual_edge_target = [];
  const virtual_edge_weight = [];
  const virtual_edge_hops = [];

  cytoscapeEdges.forEach((edge) => {
    virtual_edge_source.push(edge.source);
    virtual_edge_target.push(edge.target);
    virtual_edge_weight.push(edge.weight);
    virtual_edge_hops.push(edge.hops);
  });

  let experimentData = `./examples/experimentData.json`;
  const collectiveData = {};
  collectiveData.node_id = node_id;
  collectiveData.node_index = node_index;
  collectiveData.node_weight = node_weight;
  collectiveData.node_label = node_label;
  collectiveData.node_neighbors = node_neighbors;
  collectiveData.node_parent = node_parent;
  collectiveData.node_x = node_x;
  collectiveData.node_y = node_y;
  collectiveData.edge_source = edge_source;
  collectiveData.edge_target = edge_target;
  collectiveData.edge_weight = edge_weight;
  collectiveData.node_perplexity = node_perplexity;
  collectiveData.virtual_edge_source = virtual_edge_source;
  collectiveData.virtual_edge_target = virtual_edge_target;
  collectiveData.virtual_edge_weight = virtual_edge_weight;
  collectiveData.virtual_edge_hops = virtual_edge_hops;

  //writing the processed data into a file
  fs.writeFileSync(
    `${experimentData}`,
    JSON.stringify(collectiveData, null, 2),
    {
      encoding: 'utf8',
    }
  );

  return collectiveData;
}
