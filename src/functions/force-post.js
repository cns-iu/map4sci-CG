import { countCrossings } from './count-crossings.js';
export function forcePost(nodes, edges) {
  let forcePost_ = () => {
    for (let n of nodes) {
      [n.x0, n.y0] = [n.x, n.y];
      [n.vx0, n.vy0] = [n.vx, n.vy];
    }
    for (let n of nodes) {
      let edges1 = edges.filter(
        (e) => n.id === e.source.id || n.id === e.target.id
      );
      let t = 1.0;
      let steps = 12;
      while (steps > 0) {
        n.x = n.x0 + n.vx;
        n.y = n.y0 + n.vy;
        let crossings = countCrossings(edges, edges1);
        if (crossings == 0) {
          break;
        } else {
          n.vx *= 0.8;
          n.vy *= 0.8;
        }
        steps -= 1;
      }
      if (steps == 0) {
        n.vx = 0;
        n.vy = 0;
        n.x = n.x0;
        n.y = n.y0;
      }
    }

    for (let n of nodes) {
      [n.x, n.y] = [n.x0, n.y0];
    }
  };

  let force = forcePost_;
  force.initialize = (nodes1, edges1) => {
    nodes = nodes1;
    edges = edges1;
    return force;
  };

  return force;
}
