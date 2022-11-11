import { isCrossed } from './is-crossed.js';

export function countCrossings(edges0, edges1) {
  //count crossings between all [edges0] and [edges1]
  let count = 0;
  for (let i = 0; i < edges0.length; i++) {
    edges0[i].crossed = false;
  }
  if (edges1 === undefined) {
    edges1 = edges0;
  } else {
    for (let i = 0; i < edges1.length; i++) {
      edges1[i].crossed = false;
    }
  }

  for (let i = 0; i < edges0.length; i++) {
    let e0 = edges0[i];
    for (let j = 0; j < edges1.length; j++) {
      let e1 = edges1[j];
      let isIncident =
        e0.source.id === e1.source.id ||
        e0.source.id === e1.target.id ||
        e0.target.id === e1.source.id ||
        e0.target.id === e1.target.id;

      count += !isIncident && isCrossed(e0, e1);
    }
  }
  return count;
}
