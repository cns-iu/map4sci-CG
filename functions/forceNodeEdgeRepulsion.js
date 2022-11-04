import * as d3 from 'd3';
import { rotate } from './rotate.js';
import { searchQuadtree } from './searchQuadtree.js';

export function forceNodeEdgeRepulsion(
  nodes0,
  edges0,
  enabledNodes,
  strength0 = 1
) {
  let nodes = nodes0;
  let edges = edges0;

  function distance(a, b = { x: 0, y: 0 }) {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
  }

  function forceDir(x, y, a2, b2) {
    let dir = { x: 0, y: Math.sign(y) };
    return dir;
  }

  let strength = (n, a, b, c) => {
    let ax = Math.abs(n.x);
    let ay = Math.abs(n.y);
    if (ay > a || ax > a) {
      return 0;
    } else {
      return (strength0 * c) / (ay + c);
    }
  };

  let force = (alpha) => {
    let beta = Math.pow(alpha, 0.5);
    let tree = d3.quadtree(
      nodes,
      (d) => d.x,
      (d) => d.y
    );

    for (let j = 0; j < edges.length; j++) {
      let e = edges[j];
      let e0 = e.source;
      let e1 = e.target;
      let center = {
        x: (e0.x + e1.x) / 2,
        y: (e0.y + e1.y) / 2,
      };
      let dx = e1.x - e0.x;
      let dy = e1.y - e0.y;
      let r = Math.sqrt(dx * dx + dy * dy);
      let cos = dx / r;
      let sin = dy / r;
      let c = Math.sqrt(dx * dx + dy * dy) / 2;
      let b = c / 2;
      let b2 = b * b;
      let a = Math.sqrt(b2 + c * c);
      let a2 = a * a;

      let f0 = translate(e0, -center.x, -center.y);
      let f1 = translate(e1, -center.x, -center.y);
      f0 = rotate(f0, cos, -sin);
      f1 = rotate(f1, cos, -sin);

      let xmin = Math.min(e0.x, e1.x) - r;
      let xmax = Math.max(e0.x, e1.x) + r;
      let ymin = Math.min(e0.y, e1.y) - r;
      let ymax = Math.max(e0.y, e1.y) + r;
      e.neighbors = new Set(
        searchQuadtree(
          tree,
          (d) => d.x,
          (d) => d.y,
          xmin,
          xmax,
          ymin,
          ymax
        )
      );
      for (let i of e.neighbors) {
        let n = nodes[i];
        if (n.id !== e0.id && n.id !== e1.id) {
          let p = translate(n, -center.x, -center.y);
          p = rotate(p, cos, -sin);
          let k = strength(p, a, b, c);
          if (k > 0) {
            let dir = forceDir(p.x, p.y, a2, b2);
            dir = rotate(dir, cos, sin);
            let bk = beta * k;
            let bkx = bk * dir.x;
            let bky = bk * dir.y;

            //node movement
            n.vx += bkx / n.perplexity;
            n.vy += bky / n.perplexity;

            //edge movement
            let sbkx = 0.7 * bkx;
            let sbky = 0.7 * bky;
            e0.vx -= sbkx / e0.perplexity;
            e0.vy -= sbky / e0.perplexity;
            e1.vx -= sbkx / e1.perplexity;
            e1.vy -= sbky / e1.perplexity;
          }
        }
      }
    }
  };

  force.initialize = (nodes1, edges1) => {
    nodes = nodes1;
    edges = edges1;
    return force;
  };
  return force;
}
function translate(p, tx, ty) {
  let res = {
    x: p.x,
    y: p.y,
  };
  res.x += tx;
  res.y += ty;
  return res;
}
