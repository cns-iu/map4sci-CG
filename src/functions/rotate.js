export function rotate(p, cos, sin, center = { x: 0, y: 0 }) {
  let res = {
    x: p.x,
    y: p.y,
  };
  [res.x, res.y] = [res.x - center.x, res.y - center.y];
  [res.x, res.y] = [res.x * cos + res.y * -sin, res.x * sin + res.y * cos];
  [res.x, res.y] = [res.x + center.x, res.y + center.y];
  return res;
}