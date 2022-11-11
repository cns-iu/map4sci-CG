import { countCrossings } from './count-crossings.js';
export function initNodePosition(
  newNodes,
  root,
  currentNodes0,
  allNodes,
  allEdges,
  id2index
) {
  for (let node of newNodes) {
    node.update = true;
    if (node.id == root.id) {
      node.x = 0;
      node.y = 0;
      continue;
    }

    let currentEdges = allEdges.filter((e) => {
      return e.source.update && e.target.update;
    });

    let parent = allNodes[id2index[node.parent]];
    let count = 1;
    let r = 1;
    let edges1 = allEdges.filter(
      (e) =>
        (currentNodes0.has(e.source.id) && node.id === e.target.id) ||
        (currentNodes0.has(e.target.id) && node.id === e.source.id)
    );

    do {
      r *= 0.8;
      if (parent.id === root.id) {
        node.x = root.x + (Math.random() - 0.5) * r;
        node.y = root.y + (Math.random() - 0.5) * r;
      } else {
        let dx = parent.x - root.x;
        let dy = parent.y - root.y;
        let l = Math.sqrt(dx * dx + dy * dy);
        let cos = dx / l;
        let sin = dy / l;
        node.x = parent.x + r * (node.weight * 2) * cos;
        node.y = parent.y + r * (node.weight * 2) * sin;
      }
      count += 1;
    } while (countCrossings(currentEdges, edges1) > 0);
    currentNodes0.add(node.id);
  }
  return currentNodes0;
}
