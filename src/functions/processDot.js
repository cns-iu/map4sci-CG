import * as fs from 'fs';
import { cytoscapeLayout } from './cytoscape-layout.js';

export async function processDot(data) {
  console.log("Processing Dot FIle\n")
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
      let foundPos = false;
      node.attr_list.forEach((item) => {
        if (item.id === 'label') {
          node_label.push(item.eq);
        } else if (item.id === 'weight') {
          node_weight.push(parseFloat(item.eq));
        } else if (item.id === 'pos') {
          const [x, y] = item.eq.split(',').map(parseFloat);
          node_x.push(x);
          node_y.push(y);
          foundPos = true;
        }
      });
      if (!foundPos) {
        node_x.push(Math.random() * 1000);
        node_y.push(Math.random() * 1000);
      }
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

  const virtual_edge_source = [];
  const virtual_edge_target = [];
  const virtual_edge_weight = [];
  const virtual_edge_hops = [];

  const experimentData = `./examples/experimentData.json`;
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
 
  const cy = await cytoscapeLayout(collectiveData)

  const cytoscapeEdges = [];
  for (const source of node_id) {
    //calculating weights from every node to all the other nodes
    const weightedPaths = cy
      .elements()
      .dijkstra(cy.$id(source.toString()), function (edge) {
        return edge.data('weight');
      });
    //calculating hops from every node to all the other node
    const hopsFunction = cy
      .elements()
      .dijkstra(cy.$id(source.toString()), function (edge) {
        return 1;
      });

    for (const target of node_id) {
      let weight = weightedPaths.distanceTo(cy.$id(target.toString()));
      let hops = hopsFunction.distanceTo(cy.$id(target.toString()));

      if (source !== target) {
        cytoscapeEdges.push({
          source,
          target: target,
          weight: weight,
          hops: hops,
        });
      }
    }
  }
  cytoscapeEdges.forEach((edge) => {
    virtual_edge_source.push(edge.source);
    virtual_edge_target.push(edge.target);
    virtual_edge_weight.push(edge.weight);
    virtual_edge_hops.push(edge.hops);
  });

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

  return { collectiveData, cy };
}
