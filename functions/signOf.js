export function signOf(p, l0, l1) {
  let a = l0.y - l1.y;
  let b = -(l0.x - l1.x);
  let c = l0.y * (l0.x - l1.x) - l0.x * (l0.y - l1.y);
  let z = p.x * a + p.y * b + c;
  let epsilon = 1e-8;
  if (z > epsilon) {
    return +1;
  } else if (z < -epsilon) {
    return -1;
  } else {
    return 0;
  }
}
