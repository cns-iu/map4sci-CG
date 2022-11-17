import * as d3 from 'd3';
import * as math from 'mathjs';

export function preprocess(data) {
  const IS_PROGRESSIVE = true;
  let nodes;
  const window = {};
  window.data = data;
window.progress = IS_PROGRESSIVE ? 1 : data.nodes.length;
window.enabledNodes = new Set(data.node_id.slice(0, window.progress));

  data.nodes = [];
  for (let i = 0; i < data.node_id.length; i++) {
    data.nodes[i] = {};
    for (let k in data) {
      if (k.slice(0, 5) === 'node_') {
        data.nodes[i][k.slice(5)] = data[k][i];
      }
    }
  }
  if (nodes !== undefined) {
    if (nodes[0].nodeCount === undefined) {
      nodes.forEach((d, i) => {
        d.nodeCount = data.node_nodeCount[i];
      });
    }
    if (nodes[0].weight === undefined) {
      nodes.forEach((d, i) => {
        d.weight = data.node_weight[i];
      });
    }
    if (nodes[0].perplexity === undefined) {
      nodes.forEach((d, i) => {
        d.perplexity = data.node_perplexity[i];
      });
    }
    data.nodes0 = data.nodes;
    data.nodes = nodes;
  }

  const cx = d3.mean(data.nodes, (d) => d.x);
  const cy = d3.mean(data.nodes, (d) => d.y);
  for (let n of data.nodes) {
    n.x -= cx;
    n.y -= cy;
  }

  data.edges = [];
  for (let i = 0; i < data.edge_source.length; i++) {
    data.edges[i] = {};
    for (let k in data) {
      if (k.slice(0, 5) === 'edge_') {
        data.edges[i][k.slice(5)] = data[k][i];
      }
    }
  }

  if (data.virtual_edge_source !== undefined) {
    data.virtual_edges = [];
    for (let i = 0; i < data.virtual_edge_source.length; i++) {
      data.virtual_edges[i] = {};
      for (let k in data) {
        if (k.slice(0, 13) === 'virtual_edge_') {
          data.virtual_edges[i][k.slice(13)] = data[k][i];
        }
      }
    }
  }

  const prescale_pos = 1;
  const prescale_weight = 1;

  data.id2index = {};
  data.nodes.forEach((d, i) => {
    if (d.x === undefined) {
      d.x = Math.random() * 100;
      d.y = Math.random() * 100;
      d.x *= prescale_pos;
      d.y *= prescale_pos;
    } else {
      d.x *= prescale_pos;
      d.y *= prescale_pos;
      d.xInit = d.x;
      d.yInit = d.y;
    }
    d.index = i;
    data.id2index[d.id] = d.index;
    d.label = d.label.slice(0, 16);
    d.norm = Math.sqrt(d.x * d.x + d.y * d.y);
    d.update = IS_PROGRESSIVE ? window.enabledNodes.has(d.id) : true;
  });
  data.node_center = math.mean(
    data.nodes.map((d) => [d.x, d.y]),
    0
  );

  //preprocess edges
  for (let e of data.edges) {
    e.source = data.nodes[data.id2index[e.source]];
    e.target = data.nodes[data.id2index[e.target]];
    e.weight *= prescale_weight;
  }

  if (data.virtual_edges !== undefined) {
    for (let e of data.virtual_edges) {
      e.source = data.nodes[data.id2index[e.source]];
      e.target = data.nodes[data.id2index[e.target]];
      e.weight *= prescale_weight;
    }
  }
}
