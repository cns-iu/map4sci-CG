perplexity = node degree (children if its a tree or all edges connected to node... ?)

Use graphology https://www.npmjs.com/package/graphology and https://www.npmjs.com/package/graphology-shortest-path


HOPS => https://graphology.github.io/standard-library/shortest-path#singlesourcelength
weights => https://graphology.github.io/standard-library/shortest-path#dijkstra-singlesource



import { tree } from 'd3-hierarchy'
import Graph from 'graphology';

const graph = new Graph();

// Adding some nodes
graph.addNode('John');
graph.addNode('Martha');

// Adding an edge
graph.addEdge('John', 'Martha');

const weightedPaths = dijkstra.singleSource(graph, source, 'weight'); // d in original code
const hops = singleSourceLength(graph, source);
