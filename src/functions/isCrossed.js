import { signOf } from './signOf.js';

export function isCrossed(e0, e1) {
  let p0 = e0.source;
  let p1 = e0.target;
  let q0 = e1.source;
  let q1 = e1.target;
  return (
    signOf(q0, p0, p1) * signOf(q1, p0, p1) <= 0 &&
    signOf(p0, q0, q1) * signOf(p1, q0, q1) <= 0
  );
}
