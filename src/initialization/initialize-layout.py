from time import time
import re
import json
from natsort import natsorted
from glob import glob
from pathlib import Path
import os
import sys
import csv
import math
from random import random, shuffle
import networkx as nx
import numpy as np
from tqdm import tqdm
from networkx.drawing.nx_agraph import read_dot as nx_read_dot


# eg: command python3 init-py/init-layout.py examples/batchtree/last-fm.dot examples/csv/last-fm.csv


dotfile = sys.argv[1]


def createEdgeData(dotfile):
    G = nx_read_dot(dotfile)
    edges = {}
    for e, datadict in G.edges.items():
        source = e[0]
        target = e[1]
        level = datadict["level"]
        if level in edges:
            edges[level].append((source, target))
        else:
            edges[level] = [(source, target)]
    finalEdges = {}
    for level in sorted(edges.keys()):
        finalEdges[level] = edges[level]
        if (int(level) > 1):
            prev = int(level)-1
            finalEdges[level] += edges[str(prev)]
    return finalEdges


def edges2graph(edgeList, i2k=None, label2i=None):
    nodes = set()
    edges = set()
    for edge in edgeList:
        source, target = edge
        nodes.update([source, target])
        edges.add((source, target))

    if label2i is None:
        label2i = {k: i for i, k in enumerate(nodes)}
        i2k = list(range(len(nodes)))
    g = nx.Graph()

    nodes = [dict(id=label2i[k], label=k) for i, k in enumerate(nodes)]
    ids = [n['id'] for n in nodes]
    g.add_nodes_from(zip(ids, nodes))

    edges = [(i2k[label2i[e[0]]], i2k[label2i[e[1]]]) for e in edges]
    g.add_edges_from(edges)
    return g, i2k, label2i


def fan(nodes,
        origin=[0, 0], radii=[],
        phaseCenter=0, phaseRange=np.pi,
        weights=[1, 1],
        mode='random'):
    pos = {}
    phases = {}
    ranges = {}
    n = len(nodes)
    cos, sin = np.cos, np.sin

    weightTotal = sum(weights)
    weights = [w/weightTotal for w in weights]

    nr = sorted(zip(nodes, weights, radii), key=lambda x: x[1])

    if mode == 'center':
        # centralize heavy sub trees
        nr2 = []
        for i in list(range(len(nr)))[::-1]:
            if i % 2 == 0:
                nr2.append(nr[i])
            else:
                nr2.insert(0, nr[i])
    elif mode == 'random':
        shuffle(nr)
        nr2 = nr

    nodes, weights, radii = zip(*nr2)
    weightCumSum = [sum(weights[:i]) for i in range(len(weights)+1)]
    for i in range(n):
        angle_offset = (weightCumSum[i]+weightCumSum[i+1])/2 * phaseRange
        angle_i = phaseCenter - phaseRange/2 + angle_offset
        ri = radii[i]
        pos[nodes[i]] = [origin[0] + ri *
                         cos(angle_i), origin[1] + ri*sin(angle_i)]
        phases[nodes[i]] = angle_i
        ranges[nodes[i]] = weights[i] * phaseRange * 0.9
    return pos, phases, ranges


def radial_layout(g, root=None, mode='center', origin=[0, 0], phase0=0, range0=np.pi*2):
    g0 = g
    g = nx.bfs_tree(g, source=root)
    pos = {}
    phases = {}
    ranges = {}
    depth_from_root = nx.shortest_path_length(g, root)

    if root is None:
        root = next(iter(g.nodes))
    pos[root] = origin
    phases[root] = phase0
    ranges[root] = range0
    roots = [root, ]
    depth = 1
    while len(pos) < len(g.nodes):
        newRoots = []
        for root in roots:
            neighbors = [n for n in g.neighbors(root) if n not in pos]
            if len(neighbors) > 0:
                edge_lengths = [g0.edges[(root, n)]['weight']
                                for n in neighbors]
                subTreeSizes = [len(nx.bfs_tree(g, i).nodes)
                                for i in neighbors]

                degrees = [g.degree[i] for i in neighbors]

                depths = [depth_from_root[i] for i in neighbors]

                weights = [z for x, y, z in zip(degrees, depths, subTreeSizes)]

                newRoots += neighbors
                newPos, newPhases, newRanges = fan(
                    neighbors,
                    mode=mode,
                    origin=origin, radii=[
                        depth for e in edge_lengths],
                    phaseCenter=phases[root],
                    phaseRange=ranges[root],
                    weights=weights,
                )
                pos.update(newPos)
                phases.update(newPhases)
                ranges.update(newRanges)
        roots = newRoots
        depth += 1
    return pos


edgeData = createEdgeData(dotfile)

levels = list(range(1, len(edgeData.keys())+1))
maxLevel = max(*levels)
print("Maximum Level is",maxLevel)

fn_out = Path(sys.argv[2])

dir_out = fn_out.parent

# linear increment
baseWeight = 200
increment = 50
weights = [baseWeight+(maxLevel-l)*increment for l in levels]


weights = [w/200 for w in weights]

for i, (edgeList, level, weight) in list(enumerate(zip(edgeData.values(), levels, weights)))[::-1]:

    if level == maxLevel:
        subgraph, i2k, label2i = edges2graph(edgeList)
        g = subgraph
    else:
        subgraph, _, _ = edges2graph(edgeList, i2k, label2i)
    nodeCount = len(subgraph)

    for n in subgraph.nodes:
        g.nodes[n]['weight'] = weight

    for e in subgraph.edges:
        g.edges[e]['weight'] = weight


print('all_pairs_shortest_path...')


apsp = nx.all_pairs_dijkstra_path_length(g, weight='weight')

d = np.zeros([len(g.nodes), len(g.nodes)])

for dk in tqdm(apsp):
    source = dk[0]
    target_dist = dk[1]
    d[source, :] = [target_dist[i] for i in range(len(g.nodes))]


print('k-hop all_pairs_shortest_path...')
apsp = nx.all_pairs_dijkstra_path_length(g, weight=1)
hops = np.zeros([len(g.nodes), len(g.nodes)])
for dk in tqdm(apsp):
    source = dk[0]
    target_dist = dk[1]
    hops[source, :] = [target_dist[i] for i in range(len(g.nodes))]

init_layout = 'radial'
t0 = time()

if init_layout == 'radial':
    root = list(g.nodes)[np.argmin(d.max(axis=1))]  # large-depth node
    pos0 = radial_layout(g, root, mode='center')

dt = time() - t0
print(f'{dt} sec')

node_order = list(g.nodes)
bfs = nx.bfs_tree(g, root)
# bfs ordering
node_order = list(bfs)
pos = pos0.copy()

if not Path(dir_out).exists():
    os.makedirs(Path(dir_out))
else:
    print(Path(dir_out), 'exists')
fn_out

for n in g.nodes:
    if 'neighbor_order' in g.nodes[n]:
        del g.nodes[n]['neighbor_order']
    else:
        break

# graph to list
nodes = {k: g.nodes[k] for k in g.nodes}
edges = [[e[0], e[1], g.edges[e]] for e in g.edges]

nodes = [{
    'id': node_order[i],
    'x': float(pos[node_order[i]][0]),
    'y': float(pos[node_order[i]][1]),
    'perplexity': len(list(nx.neighbors(g, node_order[i]))),
    **nodes[node_order[i]]
} for i in range(len(nodes))]


edges = [{
    'source': e[0],
    'target': e[1],
    **e[2]
} for e in edges]

# store the position & perplexity
for i, node in enumerate(nodes):
    try:
        parent = next(bfs.predecessors(node['id']))
    except StopIteration:
        parent = None
    node['parent'] = parent

hopThresh = 6
virtual_edges = []
for i in tqdm(range(len(nodes))):
    for j in range(i+1, len(nodes)):
        if d[i, j] == 0:
            print(f'[warning] d[{i},{j}] = 0')
        else:
            if hops[i, j] < hopThresh or random() < 1:
                dij = d[i, j]
                e = {
                    'source': i2k[i],
                    'target': i2k[j],
                    'weight': dij,
                    'hops': hops[i, j]
                }
                virtual_edges.append(e)
            else:
                continue

res = {}
for k in nodes[0]:
    res[f'node_{k}'] = [n[k] for n in nodes]
for k in edges[0]:
    res[f'edge_{k}'] = [e[k] for e in edges]

print(fn_out)

for k in virtual_edges[0]:
    res[f'virtual_edge_{k}'] = [ve[k] for ve in virtual_edges]

print(f'writing {fn_out}...')

print(label2i)

res["label2i"] = label2i

with open(fn_out, 'w', newline='') as file:
    writer = csv.writer(file)

    for key in res.keys():
        for value in res[key]:
            writer.writerow([key, value])

print('Initialization Complete!')
