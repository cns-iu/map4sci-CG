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
import json from 'big-json'
import path from 'path';


if (process.argv.length !== 4) {
  console.error(`${process.argv[0]}: <input file> <output file>`);
  process.exit(-1);
}

async function main(network, outputFile) {
  console.log('Reading FIle');
  // const INPUT_FILE = JSON.parse(fs.readFileSync(network));
  const INPUT_FILE = await readJsonFiles(network);
  console.log('Finished reading files')
  
  console
  const cy = await cytoscapeLayout(INPUT_FILE);
  preprocess(INPUT_FILE);
  const nodes = await init(INPUT_FILE, outputFile);
  // update cy with new coordinates

  // write cy graph to outputFile .. .cyjs
  let newOutput = nodes.map((c) => `${c.x}\t${c.y}\t${c.id}`).join('\n');
  fs.writeFileSync(outputFile, newOutput);

  for (const { x, y, id } of nodes) {
    cy.$id(id.toString()).position({ x, y });
  }

  const networkContent = cy.json();
  fs.writeFileSync('test-input.cyjs', JSON.stringify(networkContent, null, 2));

  return newOutput;
}

main(process.argv[2], process.argv[3]);

const combineData = {};

async function readJsonFiles(directoryPath) {
  const files = await fs.promises.readdir(directoryPath);

  for (let i = 0; i < files.length; i++) {
    if (path.extname(files[i]) === '.json') {
      const filePath = path.join(directoryPath, files[i]);
      console.log(`Reading ${filePath}`)
      let data = await ParseLargeJson(filePath);
      Object.assign(combineData, data);
      console.log(`Finished Reading ${filePath}`)
      console.log(combineData)
    }
  }

  return combineData;
}

export function ParseLargeJson(network) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(network);
    const parseStream = json.createParseStream();
    
    parseStream.on('data', function(pojo) {
      resolve(pojo);
    });
    
    readStream.on('error', function(err) {
      reject(err);
    });
    
    readStream.pipe(parseStream);
  });
}







