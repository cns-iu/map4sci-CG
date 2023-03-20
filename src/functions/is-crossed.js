import { signOf } from './sign-of.js';

/**
 * function to determine if edges cross
 * @param {Edge 0} e0 
 * @param {Edge 1} e1 
 * @returns 
 */

export function isCrossed(e0, e1) {
  const p0 = e0.source;
  const p1 = e0.target;
  const q0 = e1.source;
  const q1 = e1.target;

  // console.log("checking for crossing")
  return (
    signOf(q0, p0, p1) * signOf(q1, p0, p1) <= 0 &&
    signOf(p0, q0, q1) * signOf(p1, q0, q1) <= 0
  );
}
