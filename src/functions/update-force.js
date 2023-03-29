/**
 * Function to update nodes
 * @param {Nodes} nodes 
 * @param {Edges} edges 
 * @param {Virtual Edges} virtualEdges 
 * @param {Simiualtion} simulation 
 */


export function updateForce(nodes, edges, virtualEdges, simulation) {
  simulation.force('charge').initialize(nodes);
  simulation.force('central').initialize(nodes);

  simulation.force('link').initialize(edges);
  simulation.force('stress-edge').initialize(edges);

  simulation.force('stress').initialize(virtualEdges);

  simulation.force('node-edge-repulsion').initialize(nodes, edges);
  simulation.force('post').initialize(nodes, edges);
}
