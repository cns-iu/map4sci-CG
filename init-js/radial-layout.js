import { getBFSTree } from './bfs-tree.js';
import cytoscape from 'cytoscape';
import { fan } from './fan.js';

export function radialLayout(g, root) {
  let g0 = g;
  const origin = [0, 0];
  const phase0 = 0;
  const range0 = Math.PI * 2;
  const mode = 'center';
  const graph = getBFSTree(g, root);

  const pos = {};
  const phases = {};
  const ranges = {};

  //finding the depth of each node from the root node
  const bfs = graph.elements().bfs({
    roots: '#' + root,
    visit: (v, e, u, i, depth) => {
      v.data('depth', depth);
    },
    directed: true,
  });

  let depth_from_root = {};

  bfs.path.forEach(function (ele) {
    if (ele.isNode()) {
      // check if the current element is a node
      depth_from_root[ele.id()] = ele.data('depth');
    }
  });

  pos[root] = origin;
  phases[root] = phase0;
  ranges[root] = range0;

  let roots = [root];
  let depth = 1;

  while (Object.keys(pos).length < g.nodes().length) {
    let newRoots = [];
    for (let root of roots) {
      let neighbors = graph
        .$id(root)
        .neighborhood()
        .filter((ele) => !pos[ele.id()] && ele.isNode())
        .map((ele) => ele.id());

      if (neighbors.length > 0) {
        let edge_lengths = neighbors.map((n) =>
          graph.$id(root).edgesWith(graph.$id(n)).data('weight')
        );

        let degrees = neighbors.map((n) => graph.$id(n).degree());
        let depths = neighbors.map((neighbor) => depth_from_root[neighbor]);

        let subTreeSizes = neighbors.map((n) => {
          let count = 0;
          graph.elements().bfs({
            roots: '#' + n,
            visit: function (v, depth) {
              if (v.isNode()) {
                count++;
              }
            },
            directed: true,
          });
          return count;
        });

      
        const weights = subTreeSizes.map((s)=>s)
        console.log(weights)
        

        newRoots.push(...neighbors);
        let radii = edge_lengths.map(depth => depth)
        const {newPos,newPhases,newRanges} = fan(neighbors,origin, radii ,phases[root],ranges[root],weights)


      }
    }
    roots = newRoots
    depth+=1
    // break;
  }

}
