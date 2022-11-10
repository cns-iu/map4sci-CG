export function forcePre(scales, rotate = true) {
  let force = () => {
    if (rotate) {
      for (let n of force.nodes) {
        [n.x0, n.y0] = [n.x, n.y];
        [n.vx0, n.vy0] = [n.vx, n.vy];
      }

      let thetaBest = 0;
      let [cos, sin] = [Math.cos(thetaBest), Math.sin(thetaBest)];
      for (let n of force.nodes) {
        [n.x, n.y] = [cos * n.x0 - sin * n.y0, sin * n.x0 + cos * n.y0];
        [n.vx, n.vy] = [cos * n.vx0 - sin * n.vy0, sin * n.vx0 + cos * n.vy0];
      }
    }
  };

  force.initialize = (nodes) => {
    force.nodes = nodes;
    return force;
  };
  return force;
}
