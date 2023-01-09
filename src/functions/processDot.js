import * as fs from 'fs';

//node_parent not needed
//"node_nodeCount"not needed
//node level is not needed
//node_neighbors is not needed
//node_x is needed but not node_y 
//node_index not needed
//edge_level is not needed

export function processDot(data) {
  //   console.log(data[0].children[3]);
  //node_index is 0 to no of nodes
  //node id is a array of node id's
  //edge source is the source of the edges
  let node_id = [];
  let edge_source = [];
  let node_weight = [];
  let node_label = [];
  let node_neighbors = [];
  let node_x = [];
  let node_y = [];
  let edge_target = [];
  let edge_weight = [];

  data[0].children
    .filter((e) => e.type === 'node_stmt')
    .map((node) => {
      node_id.push(node.node_id.id);
      node_weight.push(node.attr_list[2].eq);
      node_label.push(node.attr_list[0].eq);
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

      // console.log(source)
      edge_source.push(source);
      edge_target.push(target);
      edge_weight.push(edgeWeight);
    });

  for (let i = 0; i < node_id.length; i++) {
    node_index.push(i);
    idToIndex[node_id[i]] = i;
  }

  node_id.forEach(() => {
    node_x.push(Math.random() * (10000 + 10000) - 10000);
    node_y.push(Math.random() * (10000 + 10000) - 10000);
  });

  let experimentData = `./examples/experimentData.json`;
  console.log(edge_source);
  const collectiveData = {};
  collectiveData.node_id = node_id;
  collectiveData.node_index = node_index;
  collectiveData.node_weight = node_weight;
  collectiveData.node_label = node_label;
  collectiveData.node_neighbors = node_neighbors;
  collectiveData.idToIndex = idToIndex;
  collectiveData.edge_source = edge_source;
  collectiveData.edge_target = edge_target;
  collectiveData.edge_weight = edge_weight;
  collectiveData.node_x = node_x;
  collectiveData.node_y = node_y;

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
