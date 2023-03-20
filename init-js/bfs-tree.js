import cytoscape from 'cytoscape';

export function getBFSTree(g, root) {
    const bfsTree = [];
    const queue = [root];
  
    // Add the root node to the BFS tree
    bfsTree.push(g.getElementById(root));
  
    // Perform BFS
    while (queue.length > 0) {
      const node = queue.shift();
  
      g.getElementById(node).outgoers().each((ele) => {
        const neighbor = ele.target().id();
  
        // Check if the neighbor node is already visited
        if (bfsTree.find(n => n.id() === neighbor)) {
          return;
        }
  
        // Add the neighbor node to the BFS tree and edge connecting it to its parent
        bfsTree.push(g.getElementById(neighbor));
        bfsTree.push(ele);
        bfsTree.push(g.getElementById(node).edgesTo(g.getElementById(neighbor)));
  
        // Add the neighbor node to the queue for further BFS
        queue.push(neighbor);
      });
    }
  
    // Add all the nodes and edges to a Cytoscape instance
    const cyBfsTree = cytoscape();
    bfsTree.forEach(ele => {
      cyBfsTree.add(ele);
    });
  
    return cyBfsTree;
  }
  
  


  