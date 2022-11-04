import { numeric } from './numeric.js';
export function forceStress(nodes, edges, nSample, stochastic = true) {
  let strength = () => 1;
  let distance = () => 1;
  let schedule = (a) => Math.sqrt(a);
  if (nSample === undefined) {
    nSample = nodes.length * 6;
  }
  let oneIter = (e, alpha) => {
    let w = strength(e);
    let d = distance(e);
    let p0 = [e.source.x, e.source.y];
    let p1 = [e.target.x, e.target.y];

    let currentDist = Math.sqrt(
      Math.pow(p0[0] - p1[0], 2) + Math.pow(p0[1] - p1[1], 2)
    );

    let dir = numeric.div(
      [p1[0] - p0[0], p1[1] - p0[1]],
      Math.max(currentDist, 1)
    );
    let coef = (currentDist - d) * w;
    coef = Math.sign(coef) * Math.min(Math.abs(coef), currentDist * 0.1, 1);

    let [dx, dy] = numeric.mul(coef, dir);
    let vx = dx * alpha;
    let vy = dy * alpha;
    e.source.vx += vx;
    e.source.vy += vy;
    e.target.vx += -vx;
    e.target.vy += -vy;
  };
  let force = (alpha) => {
    alpha = schedule(alpha);
    if (stochastic) {
      for (let i = 0; i < Math.min(nSample, edges.length); i++) {
        let e = edges[randint(0, edges.length)];
        oneIter(e, alpha);
      }
    } else {
      for (let e of edges) {
        oneIter(e, alpha);
      }
    }
  };

  force.initialize = (edges1) => {
    edges = edges1;
    return force;
  };

  force.distance = (accessor) => {
    distance = accessor;
    return force;
  };

  force.strength = (accessor) => {
    strength = accessor;
    return force;
  };

  force.schedule = (f) => {
    schedule = f;
    return force;
  };

  return force;
}

function randint(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
