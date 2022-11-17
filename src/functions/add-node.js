import { initNodePosition } from "./init-node-position.js";
import { updateForce } from "./update-force.js";

let progress = 0;
export function addNode(
    nodes,
    edges,
    enabledNodes,
    virtualEdges,
    simulation,
    dataObj
  ) {
    console.log(`${progress}/${nodes.length}`);
    const start = progress;
    progress += 1;
    const root = nodes[0];
    if (progress <= nodes.length) {
      enabledNodes = initNodePosition(
        nodes.slice(start, progress),
        root,
        enabledNodes,
        nodes,
        edges,
        dataObj.id2index
      );
      //updateforce
      updateForce(
        nodes.slice(0, progress),
        edges.filter((e) => e.source.update && e.target.update),
        virtualEdges.filter((e) => e.source.update && e.target.update),
        simulation
      );
    }
    simulation.alpha(0.99);
    return;
  }