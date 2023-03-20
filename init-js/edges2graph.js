import cytoscape from 'cytoscape';

export function edges2graph(lines, i2k = null, label2i = null) {
    const pattern = /"(.+)" -- "(.+)"/;
    const nodes = new Set();
    const edges = new Set();
  
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
  
      if (line.length > 0) {
        const [_, source, target] = line.match(pattern);
        nodes.add(source);
        nodes.add(target);
        edges.add([source, target]);
      }
    }
    if (label2i === null) {
      const nodesArray = Array.from(nodes);
      label2i = nodesArray.reduce((map, node, i) => {
        map[node] = i;
        return map;
      }, {});
      i2k = nodesArray.map((node, i) => i);
    }
  
    const nodesArray = Array.from(nodes);
  
    const nodesWithIds = nodesArray.map((node, i) => ({
      id: label2i[node],
      label: node,
    }));
    const ids = nodesWithIds.map((node) => node.id);
  
    const g = cytoscape({
      /* options */
    });
  
    nodesArray.forEach((node) => {
      g.add({
        group: 'nodes',
        data: {
          id: node.toString(),
        },
      });
    });
  
    const edgesArray = Array.from(edges);
  
    const edgesWithIds = edgesArray.map(([source, target]) => [
      i2k[label2i[source]],
      i2k[label2i[target]],
    ]);
  
    edgesArray.forEach((edge) => {
      g.add({
        group: 'edges',
        data: {
          id: `${edge[0].toString()}-${edge[1].toString()}`,
          source: edge[0].toString(),
          target: edge[1].toString(),
        },
      });
    });
    return { graph: g, i2k, label2i };
  }
  