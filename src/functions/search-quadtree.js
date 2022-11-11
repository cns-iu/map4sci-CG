export function searchQuadtree(
  quadtree,
  xGetter,
  yGetter,
  xmin,
  xmax,
  ymin,
  ymax
) {
  const results = [];
  quadtree.visit(function (node, x1, y1, x2, y2) {
    if (!node.length) {
      do {
        const d = node.data;
        const x = xGetter(d);
        const y = yGetter(d);
        if (x >= xmin && x < xmax && y >= ymin && y < ymax) {
          results.push(d.index);
        }
      } while ((node = node.next));
    }
    return x1 >= xmax || y1 >= ymax || x2 < xmin || y2 < ymin;
  });
  return results;
}
