/**
 * 
 * @param {Position} p 
 * @param {Line 0} l0 
 * @param {Line 1} l1 
 * @returns The sign
 */

export function signOf(p, l0, l1) {
  const a = l0.y - l1.y;
  const b = -(l0.x - l1.x);
  const c = l0.y * (l0.x - l1.x) - l0.x * (l0.y - l1.y);
  const z = p.x * a + p.y * b + c;
  const epsilon = 1e-8;
  if (z > epsilon) {
    return +1;
  } else if (z < -epsilon) {
    return -1;
  } else {
    return 0;
  }
}
