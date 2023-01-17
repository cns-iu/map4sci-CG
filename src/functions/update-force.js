export function updateForce(nodes, edges, virtualEdges, simulation) {
  console.log("Updating force")
  simulation.force('charge').initialize(nodes);
  simulation.force('central').initialize(nodes);

  simulation.force('link').initialize(edges);
  simulation.force('stress-edge').initialize(edges);

  simulation.force('stress').initialize(virtualEdges);

  simulation.force('node-edge-repulsion').initialize(nodes, edges);
  simulation.force('post').initialize(nodes, edges);
}
