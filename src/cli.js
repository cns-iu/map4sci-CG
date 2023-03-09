import * as fs from 'fs';
import parse from 'dotparser';
import { preprocess } from '../src/functions/preprocess.js';
import { init } from './functions/init.js';
import { processDot } from './functions/processDot.js';
import { cytoscapeLayout } from './functions/cytoscape-layout.js';
import * as readline from 'node:readline';
import split from 'split2';
import csv from 'csv-parser';
import fetch from 'node-fetch';
import JSONStream from 'JSONStream';
import merge from 'lodash.merge';
import json from 'big-json';
import path from 'path';

if (process.argv.length !== 4) {
  console.error(`${process.argv[0]}: <input file> <output file>`);
  process.exit(-1);
}

async function main(network, outputFile) {
  console.log('Reading FIle');
  const INPUT_FILE = await readCSVFile(network);
  console.log('Finished reading files');

  const cy = await cytoscapeLayout(INPUT_FILE);
  preprocess(INPUT_FILE);
  const nodes = await init(INPUT_FILE, outputFile);


  let newOutput = nodes.map((c) => `${c.x}\t${c.y}\t${c.id}`).join('\n');
  fs.writeFileSync(outputFile, newOutput);

    // update cy with new coordinates
  for (const { x, y, id } of nodes) {
    cy.$id(id.toString()).position({ x, y });
  }

  // write cy graph to outputFile .. .cyjs
  const networkContent = cy.json();
  fs.writeFileSync('test-input.cyjs', JSON.stringify(networkContent, null, 2));

  return newOutput;
}

main(process.argv[2], process.argv[3]);

async function readCSVFile(filePath) {
  // Create a readline interface for reading the file line by line
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  // Promise to resolve when all data points have been read
  const data = {};

  // Event listener for each line read
  rl.on('line', (line) => {
    // Process the data point
    // console.log(line)
    const [key, value] = line.split(',');
    if (key in data) {
      data[key].push(value);
    } else {
      data[key] = [value];
    }

  });

  // Promise to resolve when end of file is reached
  const endOfFile = new Promise((resolve) => {
    rl.on('close', () => {
      resolve();
    });
  });

  // Wait for end of file and return all data points
  await endOfFile;
  console.log(data);
  return data;
}

