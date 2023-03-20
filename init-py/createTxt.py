import json
import networkx as nx
from networkx.drawing.nx_agraph import read_dot as nx_read_dot
import sys


dotfile = sys.argv[1]
outputFileDir = sys.argv[2]


def createTxt(dotfile,outputFileDir):
    G = nx_read_dot(dotfile)

    edgeAndLevels = dict()

    idToLable = {}
    for n, nodeData in G.nodes.data():
        idToLable[n] = nodeData["label"]

    for e, datadict in G.edges.items():
        edgeAndLevels[e] = datadict
    levels = {}
    for e, datadict in G.edges.items():
        source = e[0]
        target = e[1]

        link = '"'+ source + '"'+ " -- " + '"' +target +'"'
        if datadict["level"] in levels:
            levels[datadict["level"]].append(link)
        else:
            levels[datadict["level"]] = [link]

    curLevel = 0
    for level,edges in levels.items():
        if curLevel < int(level):
            curLevel = int(level)

    # Write each element of the array to a new line in the file
    temp=[]
    for level, edges in sorted(levels.items()):
        outputFilename = f'{outputFileDir}{level}.txt'
        
        for edge in edges:
            temp.append(edge)
        with open(outputFilename, 'w') as f:
                for edge in temp:
                    f.write(edge + '\n')

createTxt(dotfile, outputFileDir)